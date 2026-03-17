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
