// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MantleFlow is Ownable, ReentrancyGuard {
    // ساختار داده‌های کسب‌وکار
    struct Business {
        address owner;
        string name;
        string description;
        uint256 cashFlowPrediction;
        bool isVerified;
        uint256 createdAt;
    }

    // ساختار فاکتور
    struct Invoice {
        uint256 id;
        address business;
        uint256 amount;
        uint256 dueDate;
        bool isPaid;
        string tokenURI;
    }

    // متغیرها
    mapping(address => Business) public businesses;
    mapping(uint256 => Invoice) public invoices;
    mapping(address => uint256[]) public businessInvoices;
    
    address public flowTokenAddress;
    uint256 public nextInvoiceId = 1;
    
    // رویدادها
    event BusinessRegistered(address indexed owner, string name, uint256 cashFlowPrediction);
    event InvoiceCreated(uint256 indexed invoiceId, address business, uint256 amount);
    event InvoicePaid(uint256 indexed invoiceId, uint256 amount);

    constructor(address _flowTokenAddress) {
        flowTokenAddress = _flowTokenAddress;
        emit BusinessRegistered(msg.sender, "Admin", 0);
    }

    // ثبت کسب‌وکار جدید
    function registerBusiness(string calldata _name, string calldata _description, uint256 _cashFlowPrediction) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(businesses[msg.sender].owner == address(0), "Business already registered");
        
        businesses[msg.sender] = Business({
            owner: msg.sender,
            name: _name,
            description: _description,
            cashFlowPrediction: _cashFlowPrediction,
            isVerified: false,
            createdAt: block.timestamp
        });
        
        emit BusinessRegistered(msg.sender, _name, _cashFlowPrediction);
    }

    // ایجاد فاکتور
    function createInvoice(uint256 _amount, uint256 _dueDate, string calldata _tokenURI) external {
        require(businesses[msg.sender].owner != address(0), "Business not registered");
        require(_amount > 0, "Invalid amount");
        require(_dueDate > block.timestamp, "Invalid due date");
        
        uint256 invoiceId = nextInvoiceId++;
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            business: msg.sender,
            amount: _amount,
            dueDate: _dueDate,
            isPaid: false,
            tokenURI: _tokenURI
        });
        
        businessInvoices[msg.sender].push(invoiceId);
        
        emit InvoiceCreated(invoiceId, msg.sender, _amount);
    }

    // پرداخت فاکتور
    function payInvoice(uint256 _invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.business != address(0), "Invoice does not exist");
        require(!invoice.isPaid, "Invoice already paid");
        require(block.timestamp <= invoice.dueDate, "Invoice expired");
        
        // انتقال توکن به کسب‌وکار
        bool success = IERC20(flowTokenAddress).transferFrom(msg.sender, invoice.business, invoice.amount);
        require(success, "Token transfer failed");
        
        invoice.isPaid = true;
        
        emit InvoicePaid(_invoiceId, invoice.amount);
    }

    // دریافت فاکتورهای یک کسب‌وکار
    function getBusinessInvoices(address _business) external view returns (Invoice[] memory) {
        uint256[] memory invoiceIds = businessInvoices[_business];
        Invoice[] memory result = new Invoice[](invoiceIds.length);
        
        for (uint256 i = 0; i < invoiceIds.length; i++) {
            result[i] = invoices[invoiceIds[i]];
        }
        
        return result;
    }

    // دریافت اطلاعات کسب‌وکار
    function getBusiness(address _owner) external view returns (Business memory) {
        return businesses[_owner];
    }

    // فعال کردن قابلیت Ownable بعد از کانسترکتور
    function initializeOwner() external {
        // این تابع فقط برای تست هست و در واقعیت نیاز نیست
        // چون Ownable به صورت خودکار owner رو تنظیم می‌کنه
    }
}
