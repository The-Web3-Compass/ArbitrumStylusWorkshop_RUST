# Comprehensive Prompt for Building CandyToken dApp

## Project Overview

Create a complete decentralized application (dApp) for deploying and interacting with an ERC20 token called "CandyToken" on the Arbitrum Sepolia testnet. The project should consist of:

1. A Rust-based smart contract using Arbitrum Stylus SDK that implements the ERC20 standard with minting capabilities
2. A React frontend that allows users to connect their wallet, mint tokens, and transfer tokens to other addresses

## Smart Contract Requirements

### Contract Structure

Create a modular Rust project with the following structure:
- `lib.rs`: Main contract entry point with CandyToken implementation
- `erc20.rs`: Core ERC20 implementation
- `main.rs`: Binary target for deployment

### Contract Features

1. **Token Configuration**:
   - Name: "CandyToken"
   - Symbol: "CANDY"
   - Decimals: 18

2. **ERC20 Standard Functions**:
   - `balanceOf(address)`: Get token balance of an address
   - `transfer(address, amount)`: Transfer tokens to another address
   - `approve(address, amount)`: Approve spending by another address
   - `transferFrom(from, to, amount)`: Transfer tokens from one address to another
   - `allowance(owner, spender)`: Check spending allowance

3. **Additional Functions**:
   - `mint(amount)`: Mint tokens to the caller's address
   - `mint_to(address, amount)`: Mint tokens to a specified address
   - `burn(amount)`: Burn tokens from the caller's address

4. **Events**:
   - `Transfer(from, to, amount)`: Emitted when tokens are transferred
   - `Approval(owner, spender, amount)`: Emitted when approval is set

### Implementation Details

1. Use the Arbitrum Stylus SDK for Rust
2. Implement proper error handling for insufficient balances and allowances
3. Use the `sol_storage!` macro for Solidity-compatible storage
4. Use the `#[public]` attribute for external functions
5. Use the `#[inherit]` attribute for inheriting ERC20 functionality

## Frontend Requirements

### React Application Structure

Create a React application with the following structure:
- `App.js`: Main component with wallet connection and contract interaction
- `config.js`: Network and contract configuration
- `components/`: UI components
  - `ConnectWallet.js`: Wallet connection component
  - `CandyMachine.js`: Visual candy machine animation
  - `TokenForm.js`: Form components for token interactions

### Frontend Features

1. **Wallet Connection**:
   - Detect MetaMask installation
   - Connect to MetaMask
   - Display connected account
   - Handle account changes

2. **Network Management**:
   - Check if user is on Arbitrum Sepolia
   - Prompt to switch networks if needed
   - Add Arbitrum Sepolia to MetaMask if not present

3. **Token Interaction**:
   - Initialize contract instance with ethers.js
   - Display token name, symbol, and user balance
   - Mint tokens to user's address
   - Transfer tokens to other addresses
   - Show transaction status and confirmation

4. **UI/UX**:
   - Candy-themed design with animations
   - Clear error messages and success notifications
   - Loading indicators for transactions
   - Confetti animation on successful minting

### Implementation Details

1. Use ethers.js for blockchain interaction
2. Use React hooks for state management
3. Implement proper error handling for contract interactions
4. Add validation to prevent self-transfers
5. Handle BigNumber conversion correctly to avoid overflow errors

## Deployment Instructions

### Smart Contract Deployment

1. Build the contract:
   ```bash
   cd contracts
   cargo build --release
   ```

2. Generate ABI:
   ```bash
   cargo stylus export-abi
   ```

3. Deploy to Arbitrum Sepolia:
   ```bash
   cargo stylus deploy \
     --private-key YOUR_PRIVATE_KEY \
     --network arbitrum-sepolia \
     --wasm-file-path target/wasm32-unknown-unknown/release/stylus_erc20.wasm
   ```

4. Activate the contract:
   ```bash
   cargo stylus activate \
     --private-key YOUR_PRIVATE_KEY \
     --network arbitrum-sepolia \
     --address YOUR_CONTRACT_ADDRESS
   ```

5. Document the deployment details in `addresses.md`

### Frontend Deployment

1. Install dependencies:
   ```bash
   cd react-frontend
   npm install
   ```

2. Update configuration with the deployed contract address
3. Start the development server:
   ```bash
   npm start
   ```

## Technical Specifications

### Smart Contract

1. **Dependencies**:
   - `stylus-sdk`: Arbitrum Stylus SDK
   - `alloy-primitives`: For Ethereum types
   - `alloy-sol-types`: For Solidity type compatibility

2. **Storage Layout**:
   - `balances`: Mapping of addresses to token balances
   - `allowances`: Nested mapping of owner addresses to spender allowances
   - `total_supply`: Total token supply

3. **Error Handling**:
   - `InsufficientBalance`: When a transfer amount exceeds balance
   - `InsufficientAllowance`: When a transferFrom amount exceeds allowance

### Frontend

1. **Dependencies**:
   - `react`: UI framework
   - `ethers`: Ethereum interaction library
   - `react-confetti`: For success animations

2. **Network Configuration**:
   - Chain ID: 421614 (Arbitrum Sepolia)
   - RPC URL: https://sepolia-rollup.arbitrum.io/rpc
   - Block Explorer: https://sepolia.arbiscan.io/

3. **Contract Interaction**:
   - Use contract ABI from `CandyToken.json`
   - Handle BigNumber conversion for token amounts
   - Implement proper error handling for failed transactions

## Additional Requirements

1. **Documentation**:
   - Create a comprehensive README.md
   - Document contract deployment details in addresses.md
   - Add inline comments explaining complex logic

2. **Error Handling**:
   - Provide user-friendly error messages
   - Handle network switching errors gracefully
   - Validate inputs before sending transactions

3. **Security Considerations**:
   - Never expose private keys in frontend code
   - Validate transaction parameters
   - Handle edge cases like zero transfers

4. **User Experience**:
   - Provide clear feedback for all actions
   - Show loading states during transactions
   - Display success messages after operations

## Deliverables

1. Complete source code for:
   - Rust smart contract using Arbitrum Stylus
   - React frontend with ethers.js integration

2. Deployment information:
   - Contract address on Arbitrum Sepolia
   - Transaction hashes for deployment and activation
   - Instructions for interacting with the contract

3. Documentation:
   - Project overview
   - Setup instructions
   - Usage guide
   - Contract features and limitations

## Notes for Implementation

- The contract should allow any user to mint tokens (no owner restrictions)
- The frontend should prevent users from transferring tokens to their own address
- Handle BigNumber conversion carefully to avoid overflow errors
- Ensure proper error handling for all contract interactions
- Use async/await for all blockchain interactions
- Implement event listeners for wallet and network changes
- Provide clear feedback for all user actions
