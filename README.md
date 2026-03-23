# Nexa Store OS

A resilient, multi-location retail management platform that keeps checkout lines moving — with seamless syncing that ensures your data is always safe, even during connectivity drops.

---

## 🛠️ Core Capabilities

### ⚡ Always-On Selling
Transactions queue locally and sync to the cloud automatically when connectivity returns. No downtime, no lost sales.

### 🏢 Multi-Store Hierarchy
Host multiple independent storefronts from a single master dashboard. Each store operates in a secure data silo ensuring privacy and integrity.

### 📱 Hardware-Free QR Scanning
Scan with any smartphone camera — no dedicated laser hardware needed. Print A4 QR code label sheets and register bulk inventories through Excel imports.

### 📊 Real-Time Analytics
Track sales by store, by payment method, by day — and export branded PDF reports for your accountant in one click.

---
 
## 👤 User Roles & Dashboard

### 👑 Administrator (Global Oversight)
- **Store Provisioning**: Spin up new branch locations instantly.
- **Cross-Store Monitoring**: Real-time sales roll-ups across all branches.
- **Global Settings**: SMTP setup for low-stock alerts, custom branding.

### 💼 Store Manager (Local Operations)
- **Inventory Control**: Define categories, manage batches, trigger intelligent alerts on low-stock thresholds.
- **Bulk Data Loading**: Import inventory via Excel with background processing.
- **Staff Tracking**: Manage staff members and review reconciliation by payment type.

### 💳 Staff (Sales Interface)
- **Universal Scanner**: Device-camera scanning for fast basket tallies.
- **Checkout Queueing**: Select quantities, add items, configure payment types.
- **Receipts**: Generate immediate digital receipts.

---

## 🔒 Multi-Tenant & Staff Provisioning

Nexa features a frictionless onboarding system tailored for multi-store retail:

1. **Company Initialization (Admin)**
   - The Store Owner registers via the portal with their name, phone, store address, and description.
   - A top-level Store Tenant is created and the Admin account is provisioned automatically.

2. **Branch Management**
   - Admins create Branches underneath the main tenancy umbrella.

3. **Secure Auto-Generated Credentials**
   - New personnel are added via the Personnel Directory.
   - Nexa auto-generates secure, branded credentials (e.g., `mgr_123@yourstore.nexaos.com` + randomized temporary password).
   - Only Admins and Managers can reset access credentials.

4. **Lazy Authentication**
   - Staff log in with their temporary credentials. The backend verifies against the staff ledger, provisions a live Auth Session, and locks in their token — no multi-step email validation needed.

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router DOM |
| State | React Context + Hooks |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Auth, Database, Real-time) |
| Types | TypeScript |
| Theming | next-themes (Dark/Light mode) |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

The dev server starts at `http://localhost:5173`.

---

## 📄 License

MIT

---

Built by [@icedmist](https://github.com/icedmist)
