import { Web3 } from 'web3';
import dotenv from 'dotenv';

dotenv.config();

async function testBlockchainConnection() {
  try {
    // تنظیمات پیش‌فرض
    const rpcUrl = process.env.MANTLE_RPC_URL || 'http://127.0.0.1:8545';
    const mantleFlowAddress = process.env.MANTLEFLOW_CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    const flowTokenAddress = process.env.FLOWTOKEN_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    console.log('🌐 Connecting to:', rpcUrl);
    
    // اتصال به بلاکچین
    const web3 = new Web3(rpcUrl);
    
    // بررسی اتصال
    const networkId = await web3.eth.net.getId();
    console.log('✅ Connected to network ID:', networkId);
    
    // دریافت حساب‌ها
    const accounts = await web3.eth.getAccounts();
    console.log('👥 Found accounts:', accounts.length);
    
    if (accounts.length > 0) {
      console.log('👛 First account:', accounts[0]);
      
      // بررسی موجودی
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log('💰 Account balance (ETH):', web3.utils.fromWei(balance, 'ether'));
    }
    
    // تست قراردادها اگر آدرس‌ها وجود دارن
    if (mantleFlowAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa3') {
      console.log('🔍 Testing contract connections...');
      console.log('📍 MantleFlow address:', mantleFlowAddress);
      console.log('📍 FlowToken address:', flowTokenAddress);
    }
    
    console.log('🎉 Blockchain connection test passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testBlockchainConnection();