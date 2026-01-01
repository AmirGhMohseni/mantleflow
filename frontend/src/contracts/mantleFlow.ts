export const MantleFlowABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "dueDate", "type": "uint256" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "createInvoice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const
