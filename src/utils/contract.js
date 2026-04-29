import * as StellarSdk from '@stellar/stellar-sdk';

console.log('[CONTRACT] Contract module loading...');

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;
const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL;
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE;

console.log('[CONTRACT] Configuration:', {
  CONTRACT_ID,
  RPC_URL,
  NETWORK_PASSPHRASE: NETWORK_PASSPHRASE?.substring(0, 20) + '...'
});

// Validate Stellar SDK loaded correctly
if (!StellarSdk || !StellarSdk.Soroban) {
  console.error('[CONTRACT] Stellar SDK not loaded correctly!');
  throw new Error('Failed to load Stellar SDK');
}

// Initialize server and contract
const server = new StellarSdk.Soroban.Server(RPC_URL);
const contract = new StellarSdk.Contract(CONTRACT_ID);

console.log('[CONTRACT] Server and contract initialized');

/**
 * Vote for an option
 */
export async function vote(option, publicKey, signTransaction) {
  console.log('[CONTRACT] vote() called:', { option, publicKey });

  try {
    const sourceAccount = await server.getAccount(publicKey);
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call('vote', StellarSdk.nativeToScVal(option, { type: 'u32' }))
      )
      .setTimeout(30)
      .build();

    const simulatedTx = await server.simulateTransaction(transaction);
    
    if (simulatedTx.error) {
      throw new Error(`Simulation failed: ${simulatedTx.error}`);
    }

    const preparedTx = StellarSdk.Soroban.assembleTransaction(transaction, simulatedTx).build();
    const signedXDR = await signTransaction(preparedTx);
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE);

    const sendResponse = await server.sendTransaction(signedTx);
    
    if (sendResponse.status === 'ERROR') {
      throw new Error('Transaction failed');
    }

    // Poll for confirmation
    let getResponse = await server.getTransaction(sendResponse.hash);
    let attempts = 0;
    
    while (getResponse.status === 'NOT_FOUND' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      getResponse = await server.getTransaction(sendResponse.hash);
      attempts++;
    }

    if (getResponse.status === 'SUCCESS') {
      console.log('[CONTRACT] Vote successful');
      return await getVotes(option);
    } else {
      throw new Error('Transaction failed');
    }
  } catch (error) {
    console.error('[CONTRACT] Vote error:', error);
    throw error;
  }
}

/**
 * Get vote count for an option
 */
export async function getVotes(option) {
  console.log('[CONTRACT] getVotes() called:', option);

  try {
    const tempAccount = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
    
    const sourceAccount = {
      accountId: () => tempAccount,
      sequenceNumber: () => '0',
      incrementSequenceNumber: () => {},
    };

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call('get_votes', StellarSdk.nativeToScVal(option, { type: 'u32' }))
      )
      .setTimeout(30)
      .build();

    const simulatedTx = await server.simulateTransaction(transaction);

    if (simulatedTx.error || !simulatedTx.result) {
      console.warn('[CONTRACT] getVotes returned 0 (error or no result)');
      return 0;
    }

    const voteCount = StellarSdk.scValToNative(simulatedTx.result.retval);
    console.log('[CONTRACT] getVotes result:', voteCount);
    return voteCount;
    
  } catch (error) {
    console.error('[CONTRACT] getVotes error:', error);
    return 0;
  }
}

/**
 * Get votes for both options
 */
export async function getAllVotes() {
  console.log('[CONTRACT] getAllVotes() called');
  
  try {
    const [votes0, votes1] = await Promise.all([
      getVotes(0),
      getVotes(1)
    ]);

    return {
      option0: votes0,
      option1: votes1
    };
  } catch (error) {
    console.error('[CONTRACT] getAllVotes error:', error);
    return {
      option0: 0,
      option1: 0
    };
  }
}

console.log('[CONTRACT] Contract module loaded successfully');
