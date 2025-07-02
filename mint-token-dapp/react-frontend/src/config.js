// Configuration for the dApp
export const CONFIG = {
  // Contract deployed on Arbitrum Sepolia
  CONTRACT_ADDRESS: "0x49c31b473c3efbe8f5384eb7b77c257a961c8fc8",
  
  // Network configuration
  NETWORK: {
    chainId: "0x66eee", // Arbitrum Sepolia chainId in hex
    chainName: "Arbitrum Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://sepolia.arbiscan.io/"]
  },
  
  // Network ID as a number for comparison
  CHAIN_ID_NUM: 421614
};
