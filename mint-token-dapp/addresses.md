# CandyToken Deployment Information

## Contract Details

- **Name**: CandyToken
- **Symbol**: CANDY
- **Decimals**: 18
- **Contract Address**: `0x49c31b473c3efbe8f5384eb7b77c257a961c8fc8`
- **Network**: Arbitrum Sepolia Testnet
- **Deployment Date**: July 2, 2025

## Transaction Hashes

- **Deployment Transaction**: [0xfdfd1a9cd47ec36607dbae1ee635a0d9f39c0678ff6617a8481fcb444821020b](https://sepolia.arbiscan.io/tx/0xfdfd1a9cd47ec36607dbae1ee635a0d9f39c0678ff6617a8481fcb444821020b)
- **Activation Transaction**: [0x87cca93a30351602dfebe2c324569b503e036e54432f9994a20a09fafbac81bf](https://sepolia.arbiscan.io/tx/0x87cca93a30351602dfebe2c324569b503e036e54432f9994a20a09fafbac81bf)

## Contract Features

- Standard ERC20 functionality (transfer, approve, transferFrom)
- Owner-restricted minting capability
- Token burning functionality
- Built using Arbitrum Stylus in Rust

## Interacting with the Contract

### Frontend

The React frontend in this repository is configured to interact with the deployed contract. To use it:

1. Make sure you have MetaMask installed and connected to Arbitrum Sepolia network
2. Run the frontend with `npm start` in the react-frontend directory
3. Connect your wallet using the "Connect Wallet" button
4. Use the UI to mint tokens (owner only) or transfer tokens

### Using Directly via Ethers.js

```javascript
const { ethers } = require("ethers");
const CandyTokenABI = require("./contracts/CandyToken.json");

// Connect to Arbitrum Sepolia
const provider = new ethers.providers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");

// Connect to contract
const contractAddress = "0x49c31b473c3efbe8f5384eb7b77c257a961c8fc8";
const candyToken = new ethers.Contract(contractAddress, CandyTokenABI, provider);

// With a signer to send transactions
const wallet = new ethers.Wallet("your-private-key", provider);
const candyTokenWithSigner = candyToken.connect(wallet);

// Example: Mint tokens (owner only)
await candyTokenWithSigner.mint("recipient-address", ethers.utils.parseEther("100"));

// Example: Transfer tokens
await candyTokenWithSigner.transfer("recipient-address", ethers.utils.parseEther("10"));
```

## Contract Caching Recommendation

To optimize gas costs when interacting with the contract, cache it in ArbOS using:

```bash
cargo stylus cache bid 0x49c31b473c3efbe8f5384eb7b77c257a961c8fc8 0
```

For more information on Stylus contract caching, see the [Arbitrum documentation](https://docs.arbitrum.io/stylus/how-tos/caching-contracts).