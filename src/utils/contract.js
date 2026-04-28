import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  xdr,
  scValToNative,
  nativeToScVal,
} from '@stellar/stellar-sdk';

// Contract configuration from environment variables
const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;
const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL;
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE;

console.log('Contract Configuration:');
console.log('Contract ID:', CONTRACT_ID);
console.log('RPC URL:', RPC_URL);
console.log('Network:', NETWORK_PASSPHRASE);

// Initialize Soroban RPC server
const server = new SorobanRpc.Server(RPC_URL);

// Initialize contract
const contract = new Contract(CONTRACT_ID);

/**
 * Vote for an option
 * @param {number} option - The option to vote for (0 or 1)
 * @param {string} publicKey - User's public key
 * @param {Function} signTransaction - Function to sign transaction with wallet
 * @returns {Promise<number>} New vote count
 */
export async function vote(option, publicKey, signTransaction) {
  console.log('=== Vote Transaction Started ===');
  console.log('Option:', option);
  console.log('Public Key:', publicKey);

  try {
    // Get account from network
    console.log('Fetching account...');
    const sourceAccount = await server.getAccount(publicKey);
    console.log('Account fetched successfully');

    // Build the transaction
    console.log('Building transaction...');
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'vote',
          nativeToScVal(option, { type: 'u32' })
        )
      )
      .setTimeout(30)
      .build();

    console.log('Transaction built, preparing for simulation...');

    // Simulate transaction to get the resource fee
    console.log('Simulating transaction...');
    const simulatedTx = await server.simulateTransaction(transaction);
    
    console.log('Simulation result:', simulatedTx);

    if (SorobanRpc.Api.isSimulationError(simulatedTx)) {
      console.error('Simulation error:', simulatedTx.error);
      throw new Error(`Simulation failed: ${simulatedTx.error}`);
    }

    if (!simulatedTx.result) {
      console.error('No result from simulation');
      throw new Error('Simulation returned no result');
    }

    // Prepare the transaction with simulation results
    console.log('Preparing transaction with simulation results...');
    const preparedTx = SorobanRpc.assembleTransaction(transaction, simulatedTx).build();
    
    console.log('Transaction prepared, requesting signature...');

    // Sign transaction with wallet
    const signedXDR = await signTransaction(preparedTx.toXDR());
    console.log('Transaction signed');

    // Create transaction from signed XDR
    const signedTx = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);

    // Send transaction
    console.log('Sending transaction to network...');
    const sendResponse = await server.sendTransaction(signedTx);
    console.log('Transaction sent:', sendResponse);

    if (sendResponse.status === 'ERROR') {
      console.error('Transaction error:', sendResponse);
      throw new Error(`Transaction failed: ${sendResponse.errorResultXdr}`);
    }

    // Wait for transaction confirmation
    console.log('Waiting for confirmation...');
    let getResponse = await server.getTransaction(sendResponse.hash);
    
    // Poll for transaction status
    let attempts = 0;
    const maxAttempts = 30;
    
    while (getResponse.status === 'NOT_FOUND' && attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      getResponse = await server.getTransaction(sendResponse.hash);
      attempts++;
    }

    console.log('Transaction status:', getResponse.status);

    if (getResponse.status === 'SUCCESS') {
      console.log('=== Vote Transaction Successful ===');
      
      // Parse the result
      if (getResponse.resultMetaXdr) {
        const meta = xdr.TransactionMeta.fromXDR(getResponse.resultMetaXdr, 'base64');
        if (meta.v3()?.sorobanMeta()?.returnValue()) {
          const returnValue = meta.v3().sorobanMeta().returnValue();
          const newVoteCount = scValToNative(returnValue);
          console.log('New vote count:', newVoteCount);
          return newVoteCount;
        }
      }
      
      // If we can't parse the result, fetch the current count
      return await getVotes(option);
    } else {
      console.error('Transaction failed:', getResponse);
      throw new Error('Transaction failed');
    }

  } catch (error) {
    console.error('=== Vote Transaction Error ===');
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Get vote count for an option
 * @param {number} option - The option to get votes for (0 or 1)
 * @returns {Promise<number>} Vote count
 */
export async function getVotes(option) {
  console.log('=== Fetching Votes ===');
  console.log('Option:', option);

  try {
    // Create a temporary account for simulation (doesn't need to exist)
    const tempAccount = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
    
    // Get account (use a funded account or create temporary one)
    let sourceAccount;
    try {
      sourceAccount = await server.getAccount(tempAccount);
    } catch (e) {
      // If account doesn't exist, create a temporary one for simulation
      console.log('Using temporary account for read operation');
      sourceAccount = {
        accountId: () => tempAccount,
        sequenceNumber: () => '0',
        incrementSequenceNumber: () => {},
      };
    }

    // Build transaction to call get_votes
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'get_votes',
          nativeToScVal(option, { type: 'u32' })
        )
      )
      .setTimeout(30)
      .build();

    // Simulate transaction (read-only, no signing needed)
    console.log('Simulating get_votes transaction...');
    const simulatedTx = await server.simulateTransaction(transaction);

    console.log('Simulation result:', simulatedTx);

    if (SorobanRpc.Api.isSimulationError(simulatedTx)) {
      console.error('Simulation error:', simulatedTx.error);
      throw new Error(`Failed to get votes: ${simulatedTx.error}`);
    }

    if (!simulatedTx.result) {
      console.error('No result from simulation');
      return 0;
    }

    // Parse the result
    const resultValue = simulatedTx.result.retval;
    const voteCount = scValToNative(resultValue);
    
    console.log('Vote count for option', option, ':', voteCount);
    console.log('=== Fetch Votes Successful ===');
    
    return voteCount;

  } catch (error) {
    console.error('=== Fetch Votes Error ===');
    console.error('Error:', error);
    // Return 0 on error instead of throwing
    return 0;
  }
}

/**
 * Get votes for both options
 * @returns {Promise<{option0: number, option1: number}>}
 */
export async function getAllVotes() {
  console.log('=== Fetching All Votes ===');
  
  try {
    const [votes0, votes1] = await Promise.all([
      getVotes(0),
      getVotes(1)
    ]);

    console.log('All votes fetched:', { option0: votes0, option1: votes1 });
    
    return {
      option0: votes0,
      option1: votes1
    };
  } catch (error) {
    console.error('Error fetching all votes:', error);
    return {
      option0: 0,
      option1: 0
    };
  }
}

/**
 * Check if contract is accessible
 * @returns {Promise<boolean>}
 */
export async function checkContract() {
  try {
    console.log('Checking contract accessibility...');
    await getVotes(0);
    console.log('Contract is accessible');
    return true;
  } catch (error) {
    console.error('Contract check failed:', error);
    return false;
  }
}
