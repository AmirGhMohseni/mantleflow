import { ethers } from "hardhat";

async function main() {
  // Get network and accounts
  const network = await ethers.provider.getNetwork();
  const [deployer] = await ethers.getSigners();

  const nonce = await ethers.provider.getTransactionCount(
    deployer.address,
    "latest"
  );
  console.log("Using nonce:", nonce);

  console.log(`🔄 Deploying to network: ${network.name} (${network.chainId})`);
  console.log(`💳 Deployer address: ${deployer.address}`);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatEther(balance)} MNT`);
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance. You might need to fund this account first.");
  }

  // Deploy FlowToken
  console.log("\n🚀 Deploying FlowToken...");
  const FlowToken = await ethers.getContractFactory("FlowToken");
  const flowToken = await FlowToken.deploy();
  await flowToken.waitForDeployment();
  console.log(`✅ FlowToken deployed to: ${await flowToken.getAddress()}`);

  // Deploy MantleFlow
  console.log("\n🚀 Deploying MantleFlow...");
  const MantleFlow = await ethers.getContractFactory("MantleFlow");
  const mantleFlow = await MantleFlow.deploy(await flowToken.getAddress());
  await mantleFlow.waitForDeployment();
  console.log(`✅ MantleFlow deployed to: ${await mantleFlow.getAddress()}`);

  console.log("\n🎉 Deployment successful!");
  console.log("📋 Contract addresses:");
  console.log(`   FlowToken: ${await flowToken.getAddress()}`);
  console.log(`   MantleFlow: ${await mantleFlow.getAddress()}`);
  
  // Save addresses to .env
  const fs = require('fs');
  const envPath = '.env';
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add contract addresses
  envContent = envContent
    .replace(
      /NEXT_PUBLIC_MANTLEFLOW_CONTRACT_ADDRESS=.*/g,
      `NEXT_PUBLIC_MANTLEFLOW_CONTRACT_ADDRESS=${await mantleFlow.getAddress()}`
    )
    .replace(
      /NEXT_PUBLIC_FLOWTOKEN_CONTRACT_ADDRESS=.*/g,
      `NEXT_PUBLIC_FLOWTOKEN_CONTRACT_ADDRESS=${await flowToken.getAddress()}`
    );

  if (!envContent.includes('NEXT_PUBLIC_MANTLEFLOW_CONTRACT_ADDRESS=')) {
    envContent += `\nNEXT_PUBLIC_MANTLEFLOW_CONTRACT_ADDRESS=${await mantleFlow.getAddress()}`;
  }

  if (!envContent.includes('NEXT_PUBLIC_FLOWTOKEN_CONTRACT_ADDRESS=')) {
    envContent += `\nNEXT_PUBLIC_FLOWTOKEN_CONTRACT_ADDRESS=${await flowToken.getAddress()}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("💾 Contract addresses saved to .env file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });