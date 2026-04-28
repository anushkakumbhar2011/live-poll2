import { useState, useEffect } from "react";
import { vote as contractVote, getVotes, getAllVotes } from "../utils/contract";

export default function Poll({ walletAddress, walletKit }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [voteStatus, setVoteStatus] = useState("Idle");
  const [votes, setVotes] = useState({
    javascript: 0,
    python: 0
  });
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState("");

  // Calculate total votes and percentages
  const totalVotes = votes.javascript + votes.python;
  const jsPercentage = totalVotes > 0 ? (votes.javascript / totalVotes) * 100 : 0;
  const pyPercentage = totalVotes > 0 ? (votes.python / totalVotes) * 100 : 0;

  // Fetch votes from contract on mount and every 5 seconds
  useEffect(() => {
    console.log('Poll component mounted, fetching initial votes...');
    fetchVotes();

    // Set up interval to refresh votes every 5 seconds
    const interval = setInterval(() => {
      console.log('Auto-refreshing votes...');
      fetchVotes();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function fetchVotes() {
    try {
      console.log('Fetching votes from contract...');
      const allVotes = await getAllVotes();
      
      setVotes({
        javascript: allVotes.option0,
        python: allVotes.option1
      });
      
      console.log('Votes updated:', allVotes);
    } catch (err) {
      console.error('Error fetching votes:', err);
    }
  }

  async function handleVote(option) {
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    if (isVoting) {
      console.log('Vote already in progress');
      return;
    }

    console.log('=== Starting Vote Process ===');
    console.log('Option:', option === "javascript" ? 0 : 1);
    console.log('Wallet Address:', walletAddress);

    setSelectedOption(option);
    setVoteStatus("Pending");
    setIsVoting(true);
    setError("");

    try {
      // Map option name to contract option number
      const contractOption = option === "javascript" ? 0 : 1;

      // Sign transaction function
      const signTransaction = async (tx) => {
        console.log('Requesting wallet signature...');
        
        try {
          // Use StellarWalletsKit to sign the transaction
          const { signedTxXdr } = await walletKit.signTransaction(tx.toXDR(), {
            address: walletAddress,
            networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE,
          });
          
          console.log('Transaction signed successfully');
          return signedTxXdr;
        } catch (err) {
          console.error('Signing error:', err);
          throw new Error('Transaction signing failed');
        }
      };

      // Call contract vote function
      console.log('Calling contract vote function...');
      const newVoteCount = await contractVote(contractOption, walletAddress, signTransaction);
      
      console.log('Vote successful! New count:', newVoteCount);
      
      // Update local state
      setVotes(prev => ({
        ...prev,
        [option]: newVoteCount
      }));
      
      setVoteStatus("Success");
      
      // Fetch all votes to ensure we have the latest data
      setTimeout(() => {
        fetchVotes();
      }, 1000);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setVoteStatus("Idle");
        setSelectedOption(null);
      }, 3000);

    } catch (err) {
      console.error('=== Vote Error ===');
      console.error('Error:', err);
      
      // Determine error message
      let errorMessage = "Vote failed. Please try again.";
      
      if (err.message && err.message.includes('User declined')) {
        errorMessage = "Transaction rejected by user";
      } else if (err.message && err.message.includes('insufficient')) {
        errorMessage = "Insufficient balance for transaction";
      } else if (err.message && err.message.includes('Simulation failed')) {
        errorMessage = "Contract call failed. Please check your connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setVoteStatus("Failed");
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setVoteStatus("Idle");
        setSelectedOption(null);
        setError("");
      }, 5000);
    } finally {
      setIsVoting(false);
    }
  }

  return (
    <div className="poll-container">
      <h2 className="poll-question">Which is your favorite language?</h2>
      
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("javascript")}
          className={`vote-btn ${selectedOption === "javascript" ? "selected" : ""} ${isVoting ? "disabled" : ""}`}
          disabled={isVoting || !walletAddress}
        >
          <span className="vote-btn-icon">📜</span>
          <span className="vote-btn-text">JavaScript</span>
        </button>
        
        <button
          onClick={() => handleVote("python")}
          className={`vote-btn ${selectedOption === "python" ? "selected" : ""} ${isVoting ? "disabled" : ""}`}
          disabled={isVoting || !walletAddress}
        >
          <span className="vote-btn-icon">🐍</span>
          <span className="vote-btn-text">Python</span>
        </button>
      </div>

      {voteStatus !== "Idle" && (
        <div className="status-section">
          <div className={`status status-${voteStatus.toLowerCase()}`}>
            {voteStatus === "Pending" && <span className="spinner-small"></span>}
            {voteStatus === "Success" && <span className="status-icon">✓</span>}
            {voteStatus === "Failed" && <span className="status-icon">✗</span>}
            <span className="status-text">
              {voteStatus === "Pending" && "Processing vote on blockchain..."}
              {voteStatus === "Success" && "Vote recorded on blockchain!"}
              {voteStatus === "Failed" && (error || "Vote failed")}
            </span>
          </div>
        </div>
      )}

      <div className="results-section">
        <h3 className="results-title">Live Results (from Blockchain)</h3>
        
        <div className="result-item">
          <div className="result-header">
            <span className="option-name">
              <span className="option-icon">📜</span>
              JavaScript
            </span>
            <span className="vote-count">{votes.javascript} votes</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill progress-js" 
              style={{ width: `${jsPercentage}%` }}
            >
              {jsPercentage > 10 && <span className="progress-text">{jsPercentage.toFixed(0)}%</span>}
            </div>
          </div>
        </div>

        <div className="result-item">
          <div className="result-header">
            <span className="option-name">
              <span className="option-icon">🐍</span>
              Python
            </span>
            <span className="vote-count">{votes.python} votes</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill progress-py" 
              style={{ width: `${pyPercentage}%` }}
            >
              {pyPercentage > 10 && <span className="progress-text">{pyPercentage.toFixed(0)}%</span>}
            </div>
          </div>
        </div>

        <div className="total-votes">
          Total Votes: <strong>{totalVotes}</strong>
        </div>
      </div>
    </div>
  );
}
