# 🍭 Candy Token Minter dApp 🍬

A fun, candy-themed dApp for minting your own ERC20 tokens on Arbitrum using Stylus Rust SDK.

## Project Structure

- `/contracts` - Rust smart contract using Arbitrum Stylus SDK
- `/react-frontend` - React frontend with ethers.js integration

## Smart Contract

The ERC20 token contract is written in Rust using the Arbitrum Stylus SDK. It implements the standard ERC20 functionality with an additional minting capability for the contract owner.

### Features

- Standard ERC20 functionality (transfer, approve, transferFrom)
- Custom token name and symbol
- Minting capability (owner only)
- Arbitrum Stylus compatibility

## Frontend

The frontend is a React application with a fun candy machine theme. Users can:

1. Connect their wallet
2. Enter a token name and symbol
3. Deploy their own ERC20 token
4. Receive initial tokens in their wallet

## Getting Started

### Prerequisites

- Node.js and npm
- Rust and Cargo
- Arbitrum Stylus SDK
- MetaMask or another Ethereum wallet

### Contract Deployment

1. Navigate to the contracts directory:
   ```
   cd /Users/sneha/NamasteArbitrum/mint-token-dapp/contracts
   ```

2. Build the contract:
   ```
   cargo build --release
   ```

3. Generate the ABI:
   ```
   cargo stylus export-abi
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd /Users/sneha/NamasteArbitrum/mint-token-dapp/react-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Connect your wallet using the "Connect Wallet" button
2. Enter a name and symbol for your token
3. Click "Create Token!"
4. Confirm the transaction in your wallet
5. Once the transaction is confirmed, you'll receive your newly minted tokens

## Network Configuration

The dApp is configured to work with Arbitrum networks. Make sure your wallet is connected to one of the following networks:

- Arbitrum One (mainnet)
- Arbitrum Sepolia (testnet)

## License

This project is open source and available under the MIT License.
