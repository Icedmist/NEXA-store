# Nexa Store OS - Core System Capabilities

The Nexa Store OS is designed as a resilient retail management platform that prioritizes business continuity and multi-location control.

## 1. Core System Capabilities

### Hybrid Connectivity (Offline-First)
The system's primary function is to allow sales to continue during internet outages. Transactions are saved locally and sync automatically to the cloud once a connection is re-established.

### Multi-Store Hierarchy
A single master system that can host multiple independent storefronts. Each store operates in its own data "silo," ensuring privacy and security between different locations.

### QR-Driven Inventory
The OS uses QR codes as the primary method for product identification, reducing manual entry errors and speeding up the checkout process.

## 2. User Role Functionality

The system is divided into three functional modules based on the user's responsibilities:

### A. Administrator (Global Oversight)

- **Store Provisioning**: Ability to create new store profiles and generate unique activation codes.
- **Global Settings**: Configuration of system-wide email (SMTP) for alerts and customized branding (colors/logos).
- **Cross-Store Monitoring**: A high-level dashboard to view real-time sales performance across all registered stores.

### B. Store Manager (Local Operations)

- **Inventory Control**: Tools to create product categories and manage individual stock items.
- **Label Generation**: Functionality to generate and print A4 sheets of QR code labels for physical products.
- **Staff Management**: Ability to create and manage "Cashier" accounts for their specific location.
- **Local Analytics**: Access to store-specific reports, including daily revenue and "Most Sold" item lists.

### C. Cashier (Sales Interface)

- **Universal Scanner**: A specialized interface that uses a device's camera to scan product QR codes instantly.
- **Cart & Checkout**: Real-time calculation of totals, quantity adjustments, and selection of payment methods (Cash, Card, etc.).
- **Receipt Issuance**: Immediate generation and printing of digital or physical sales receipts.

## 3. Enhanced Modifications & Features

These specific functional additions have been integrated to improve the standard POS workflow:

### Bulk Data Management
Instead of manual entry, managers can upload entire inventories via CSV or Excel files. This feature includes a "queue" system that handles large uploads even while offline.

### Intelligent Stock Alerts
The system monitors inventory levels automatically. When a product hits a pre-defined "Low Stock" threshold, the OS sends an automated email notification to the manager.

### Payment Method Tracking
The POS doesn't just record sales; it categorizes them by payment type, allowing for detailed end-of-day reconciliation between cash-in-hand and digital payments.

### Hardware-Free Scanning
The system is optimized to use standard smartphone or tablet cameras as high-speed scanners, removing the requirement for dedicated laser scanning hardware.

### Data Portability
All sales and inventory data can be exported into spreadsheet formats for external accounting or long-term record keeping.
