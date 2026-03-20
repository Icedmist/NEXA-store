# Nexa Retail Hub — Store OS

A resilient, multi-location retail management platform designed with **offline-first functionality** to keep checkout lines moving even when the internet goes down. 

---

## 🛠️ Core Capabilities

### ⚡ Hybrid Connectivity (Offline-First)
The primary function is holding transactions locally and sinking to the cloud safely only when connectivity is back. Avoid downtime under any internet fluctuation.

### 🏢 Multi-Store Hierarchy
Host multiple independent storefronts from a single master dashboard. Each store operates in a secure data silo ensuring local privacy and integrity.

### 📱 Hardware-Free QR Scanning
Optimized scans using simple smart-device cameras rather than bulky laser gear. Print A4 sheets of QR code labels smoothly and register bulk inventories through Excel streams.

---

## 👤 User Roles & Dashboard

The management portal caters heavily to three different operation types:

### 👑 Administrator (Global Oversight)
- **Store Provisioning**: Spin up new locations into unique activation branches.
- **Cross-Store Monitoring**: Real-time roll-ups regarding sales across all branches.
- **Global Settings**: Core SMTP setup for low-stock triggers, custom branding alignment.

### 💼 Store Manager (Local Operations)
- **Inventory Control**: Define categories, control batches, trigger **Intelligent Alerts** when hitting low-thresh margins.
- **Bulk Data Loading**: Handle manual batch Excel insertion into a background streaming queue safely.
- **Staff Tracking**: Manage cashiers and review total reconciliation by payment type (Cash vs Card).

### 💳 Cashier (Sales Interface)
- **Universal Scanner**: Device-camera instant scanning portal for faster basket tallies.
- **Checkout Queueing**: Instantly select quantities, add items, configure payment types for sync checks.
- **Receipts**: Generate immediate digital prints or triggers correctly.

---

## 🔒 Multi-Tenant & Staff Provisioning Flow

Nexa Retail Hub features a sophisticated, frictionless onboarding system tailored for multi-store retail deployment:

1. **Company Initialization (Admin)**
   - The primary Store Owner registers via the main access portal.
   - The application dynamically creates a top-level Store Tenant (e.g. *Pardoom*) and provisions the Admin account automatically.
   - The entire application instance adapts to this brand name contextually across the UI and logic barriers.

2. **Branch Management**
   - The Admin creates subsequent **Branches** (rather than independent disconnected stores) underneath the umbrella of the main tenancy. 

3. **Secure Auto-Generation (Managers & Staff)**
   - Creating new personnel is handled entirely within the *Personnel Directory*.
   - Instead of requiring employees to use their personal emails and go through a vulnerable signup portal, Nexa auto-generates secure, branded credentials.
   - Example: Adding a manager dynamically creates `mgr_123@pardoom.nexaos.com` alongside a highly-randomized 8-character temporary payload password.
   - Only Admins and top-tier Managers can reset these access credentials directly. Agent endpoints remain strictly locked down from accessing sensitive settings.

4. **Lazy Authentication & Resolution**
   - To bypass traditional multi-step email validations in fast-paced retail environments, Nexa uses *Lazy Registration*. 
   - When newly-created staff attempt to log in for the very first time using their given temporary credentials, the backend invisibly verifies against the encrypted staff ledger, provisions their live Auth Session in real-time, and locks in their token securely.

---

## 💻 Tech Stack & Design

- **Frontend Core:** React 18 + Vite (fast HMR)
- **Routing:** React Router DOM
- **State Management:** `@tanstack/react-query` + React context hooks
- **Form Layout Support:** TypeScript strongly typed bindings
- **Visual Grid / Aesthetics:** TailwindCSS with dynamic micro-grids and modern Instrument layout.

---

## 🚀 Getting Started

To get the app loaded locally on node:

1. **Install dependencies**:
```bash
npm install
```

2. **Run locally (Dev server)**:
```bash
npm run dev
```

The server usually sets itself to `http://localhost:8080` (Standard fallback if Vite isn't manually reindexed).
