import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Confetti from 'react-confetti';
import './App.css';
import CandyMachine from './components/CandyMachine';
import ConnectWallet from './components/ConnectWallet';
import TokenForm from './components/TokenForm';
import CandyTokenABI from './contracts/CandyToken.json';
import { CONFIG } from './config';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenName, setTokenName] = useState('CandyToken');
  const [tokenSymbol, setTokenSymbol] = useState('CANDY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mintAmount, setMintAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize contract with signer
  const initContract = async (signer) => {
    try {
      // Connect to the deployed contract
      const contract = new ethers.Contract(
        CONFIG.CONTRACT_ADDRESS,
        CandyTokenABI,
        signer
      );
      setTokenContract(contract);
      
      // Get token details
      const name = await contract.name();
      const symbol = await contract.symbol();
      setTokenName(name);
      setTokenSymbol(symbol);
      
      // Get user balance
      const userAddress = await signer.getAddress();
      const userBalance = await contract.balanceOf(userAddress);
      setBalance(ethers.utils.formatEther(userBalance));
    } catch (error) {
      console.error("Error initializing contract:", error);
      setError("Failed to connect to the CandyToken contract");
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    // Check if MetaMask is installed
    const { ethereum } = window;
    if (!ethereum || !ethereum.isMetaMask) {
      setError("Please install MetaMask to use this dApp");
      return;
    }
    
    try {
      // Create a new provider instance to ensure we have the latest state
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      const signer = web3Provider.getSigner();
      setSigner(signer);
      
      // Initialize contract with the signer
      await initContract(signer);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Failed to connect wallet: " + (error.message || "Unknown error"));
    }
  };
  
  const mintTokens = async () => {
    if (!tokenContract || !signer || !mintAmount) {
      setError("Please connect your wallet and enter an amount to mint");
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Convert the amount to a string first to avoid BigNumber issues
      const amountStr = mintAmount.toString();
      const amount = ethers.utils.parseEther(amountStr);
      const userAddress = await signer.getAddress();
      
      // Call the mint function which mints tokens to the caller's address
      // Use the string representation of the amount to avoid BigNumber issues
      const tx = await tokenContract.mint(amount.toString());
      await tx.wait();
      
      // Update balance
      const newBalance = await tokenContract.balanceOf(userAddress);
      setBalance(ethers.utils.formatEther(newBalance));
      
      setSuccessMessage(`Successfully minted ${mintAmount} ${tokenSymbol} tokens!`);
      setMintAmount('');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error("Error minting tokens:", error);
      setError("Failed to mint tokens: " + (error.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const transferTokens = async () => {
    if (!tokenContract || !signer || !transferTo || !transferAmount) {
      setError("Please connect your wallet, enter a recipient address, and an amount to transfer");
      return;
    }
    
    // Check if user is trying to transfer to their own address
    const userAddress = await signer.getAddress();
    if (transferTo.toLowerCase() === userAddress.toLowerCase()) {
      setError("You cannot transfer tokens to your own wallet address");
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Convert the amount to a string first to avoid BigNumber issues
      const amountStr = transferAmount.toString();
      const amount = ethers.utils.parseEther(amountStr);
      
      // Call the transfer function with string representation of amount
      const tx = await tokenContract.transfer(transferTo, amount.toString());
      await tx.wait();
      
      // Update balance
      const userAddress = await signer.getAddress();
      const newBalance = await tokenContract.balanceOf(userAddress);
      setBalance(ethers.utils.formatEther(newBalance));
      
      setSuccessMessage(`Successfully transferred ${transferAmount} ${tokenSymbol} tokens to ${transferTo}!`);
      setTransferTo('');
      setTransferAmount('');
    } catch (error) {
      console.error("Error transferring tokens:", error);
      setError("Failed to transfer tokens: " + (error.message || "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMintSubmit = (e) => {
    e.preventDefault();
    mintTokens();
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    transferTokens();
  };

  // Initialize provider on component mount
  useEffect(() => {
    const checkIfMetaMaskIsInstalled = () => {
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    };
    
    const initProvider = async () => {
      // Wait for window.ethereum to be injected
      if (!checkIfMetaMaskIsInstalled()) {
        setError("Please install MetaMask to use this dApp");
        return;
      }
      
      // Make sure ethereum object is fully loaded
      if (window.ethereum) {
        try {
          // Check if we need to switch to Arbitrum Sepolia network
          try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdNum = parseInt(chainId, 16);
            
            if (chainIdNum !== CONFIG.CHAIN_ID_NUM) {
              setError(`Please switch to Arbitrum Sepolia network in your MetaMask wallet. Current network ID: ${chainIdNum}`);
              
              // We'll still try to switch, but won't block the app if it fails
              try {
                // Try to switch to Arbitrum Sepolia
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: CONFIG.NETWORK.chainId }],
                });
                // Clear the error if successful
                setError('');
              } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                  try {
                    await window.ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [CONFIG.NETWORK],
                    });
                    // Clear the error if successful
                    setError('');
                  } catch (addError) {
                    console.error("Error adding network:", addError);
                    setError("Please manually add Arbitrum Sepolia network to MetaMask");
                  }
                } else {
                  console.error("Error switching network:", switchError);
                  // We already set an error above, so no need to update it here
                }
              }
            }
          } catch (chainError) {
            console.error("Error checking chain ID:", chainError);
            // Continue anyway, we'll just show a warning
          }
          
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          // Get accounts
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const signer = web3Provider.getSigner();
            setSigner(signer);
            
            // Initialize contract
            await initContract(signer);
          }
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              const signer = web3Provider.getSigner();
              setSigner(signer);
              initContract(signer);
            } else {
              setAccount('');
              setSigner(null);
              setTokenContract(null);
              setBalance('0');
            }
          });
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } catch (error) {
          console.error("Error initializing provider:", error);
          setError("Failed to connect to Ethereum provider");
        }
      } else {
        setError("Please install MetaMask to use this dApp");
      }
    };
    
    initProvider();
  }, []);

  return (
    <div className="App">
      {showConfetti && <Confetti />}
      
      <header className="App-header">
        <h1>🍭 Candy Token Dashboard 🍬</h1>
        <p>Interact with your sweet ERC20 token on Arbitrum Sepolia!</p>
      </header>
      
      <main>
        <ConnectWallet 
          account={account} 
          connectWallet={connectWallet} 
        />
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        {account ? (
          <div className="token-container">
            <div className="token-info">
              <h2>🍬 {tokenName} ({tokenSymbol})</h2>
              <p className="contract-address">Contract Address: {CONFIG.CONTRACT_ADDRESS}</p>
              <p className="balance">Your Balance: {balance} {tokenSymbol}</p>
            </div>
            
            <div className="token-actions">
              <div className="action-card">
                <h3>Mint Tokens</h3>
                <p className="note">Mint your own CandyToken tokens!</p>
                <form onSubmit={handleMintSubmit}>
                  <div className="form-group">
                    <label htmlFor="mintAmount">Amount to Mint:</label>
                    <input
                      type="text"
                      id="mintAmount"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(e.target.value)}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="action-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Mint Tokens'}
                  </button>
                </form>
              </div>
              
              <div className="action-card">
                <h3>Transfer Tokens</h3>
                <form onSubmit={handleTransferSubmit}>
                  <div className="form-group">
                    <label htmlFor="transferTo">Recipient Address:</label>
                    <input
                      type="text"
                      id="transferTo"
                      value={transferTo}
                      onChange={(e) => setTransferTo(e.target.value)}
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="transferAmount">Amount to Transfer:</label>
                    <input
                      type="text"
                      id="transferAmount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="action-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Transfer Tokens'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <CandyMachine isProcessing={isProcessing} />
        )}
      </main>
      
      <footer>
        <p>Built with ❤️ on Arbitrum Stylus by Web3Compass Team</p>
      </footer>
    </div>
  );
}

export default App;
