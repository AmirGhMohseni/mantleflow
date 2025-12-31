const { Web3 } = require('web3');
require('dotenv').config();

async function testBlockchainConnection() {
  try {
    const rpcUrl = process.env.MANTLE_RPC_URL || 'http://127.0.0.1:8545';
    const web3 = new Web3(rpcUrl);
    
    const networkId = await web3.eth.net.getId();
    console.log('✅ Connected to network ID:', networkId);
    
    const accounts = await web3.eth.getAccounts();
    console.log('👥 Found accounts:', accounts.length);
    
    if (accounts[0]) {
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log('💰 Balance of first account:', web3.utils.fromWei(balance, 'ether'));
    }
    
    console.log('🎉 Test passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testBlockchainConnection();
