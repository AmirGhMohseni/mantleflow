import { expect } from "chai";
import { ethers } from "hardhat";

describe("MantleFlow", function () {
  async function deployContracts() {
    const [owner, businessOwner, investor] = await ethers.getSigners();
    
    // Deploy FlowToken
    const FlowToken = await ethers.getContractFactory("FlowToken");
    const flowToken = await FlowToken.deploy();
    await flowToken.waitForDeployment();
    
    // Deploy MantleFlow
    const MantleFlow = await ethers.getContractFactory("MantleFlow");
    const mantleFlow = await MantleFlow.deploy(await flowToken.getAddress());
    await mantleFlow.waitForDeployment();
    
    return { owner, businessOwner, investor, flowToken, mantleFlow };
  }

  describe("Deployment", function () {
    it("Should set the right owner and flowToken address", async function () {
      const { owner, flowToken, mantleFlow } = await deployContracts();
      
      expect(await mantleFlow.owner()).to.equal(owner.address);
      expect(await mantleFlow.flowTokenAddress()).to.equal(await flowToken.getAddress());
    });
  });

  describe("Business Registration", function () {
    it("Should register a business successfully", async function () {
      const { businessOwner, mantleFlow } = await deployContracts();
      
      await mantleFlow.connect(businessOwner).registerBusiness(
        "Test Business",
        "Test Description",
        10000
      );
      
      const business = await mantleFlow.getBusiness(businessOwner.address);
      expect(business.name).to.equal("Test Business");
      expect(business.cashFlowPrediction).to.equal(10000);
      expect(business.isVerified).to.equal(false);
    });

    it("Should not allow duplicate business registration", async function () {
      const { businessOwner, mantleFlow } = await deployContracts();
      
      await mantleFlow.connect(businessOwner).registerBusiness(
        "Test Business",
        "Test Description",
        10000
      );
      
      await expect(
        mantleFlow.connect(businessOwner).registerBusiness(
          "Another Business",
          "Another Description",
          20000
        )
      ).to.be.revertedWith("Business already registered");
    });
  });

  describe("Invoice Management", function () {
    it("Should create and pay an invoice", async function () {
      const { businessOwner, investor, flowToken, mantleFlow } = await deployContracts();
      
      // Register business
      await mantleFlow.connect(businessOwner).registerBusiness(
        "Test Business",
        "Test Description",
        10000
      );
      
      // Mint tokens to investor
      const mintAmount = ethers.parseEther("10000");
      await flowToken.mint(investor.address, mintAmount);
      
      // Approve tokens for transfer
      await flowToken.connect(investor).approve(await mantleFlow.getAddress(), mintAmount);
      
      // Create invoice
      const dueDate = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      await mantleFlow.connect(businessOwner).createInvoice(
        100,
        dueDate,
        "https://example.com/invoice/1"
      );
      
      // Pay invoice
      await mantleFlow.connect(investor).payInvoice(1);
      
      const invoice = await mantleFlow.invoices(1);
      expect(invoice.isPaid).to.equal(true);
      
      // Check balances
      const businessBalance = await flowToken.balanceOf(businessOwner.address);
      expect(businessBalance).to.equal(100n);
    });
  });
});