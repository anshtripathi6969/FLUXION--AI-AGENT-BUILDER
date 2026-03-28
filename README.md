<!-- HEADER -->

<h1 align="center">⚡ Fluxion</h1>

<p align="center">
  <b>AI-Powered Workflow Automation Platform</b><br/>
  Build, automate, and scale workflows with AI + event-driven architecture
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/AI-Gemini-blueviolet?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-Inngest-black?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge"/>
</p>

<p align="center">
  <a href="https://fluxion-lime.vercel.app"><b>🌐 Live Demo</b></a> •
  <a href="#-features"><b>Features</b></a> •
  <a href="#-architecture"><b>Architecture</b></a> •
  <a href="#-getting-started"><b>Setup</b></a>
</p>

---

## 🧠 What is Fluxion?

Fluxion is a **modern AI-native workflow automation platform** that allows users to visually design workflows and execute them using an **event-driven backend**.

It combines:

* ⚡ Async execution (Inngest)
* 🤖 AI-powered nodes (Gemini)
* 🔐 Encrypted credentials
* 🎯 Real-time workflow tracking

> Think: **Zapier + AI + Developer Control**

---

## ✨ Features

### 🧩 Visual Workflow Builder

<p align="center">
  <img width="1165" height="547" alt="image" src="https://github.com/user-attachments/assets/fdd7da65-07e2-4d2b-9d2c-06ad677c5a4b" />
</p>

* Drag & drop node editor
* Connect triggers → actions
* Clean, animated UI

---

### 🤖 AI-Powered Nodes

* Gemini integration
* Dynamic prompts with variables
* AI inside workflows

---

### ⚡ Event-Driven Execution

* Powered by Inngest
* Async & scalable
* Retry + execution logs

---

### 🔐 Secure Credential Management

* AES-based encryption
* Decrypt only at runtime
* No secrets exposed

---

### 🔗 Integrations

* 🌐 HTTP APIs
* 💬 Discord Webhooks
* 📊 Google Forms
* 💼 Slack (extensible)

---

## 🏗️ Architecture

```txt
User Trigger
   ↓
Inngest Event System
   ↓
Workflow Execution Engine
   ↓
Node Processing (AI / HTTP)
   ↓
Credential Decryption
   ↓
Execution Result
   ↓
Logs + UI Update
```

---

## 🧪 Example Workflows

### 🚀 AI Motivation Bot

```txt
Manual Trigger → Gemini → Discord
```

### 📡 API → AI → Slack

```txt
HTTP Request → Gemini → Slack
```

### 📩 Form → AI → Discord

```txt
Google Form → Gemini → Discord
```

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,postgres,prisma,vercel" />
</p>

**Frontend**

* Next.js
* Tailwind CSS
* Framer Motion + GSAP

**Backend**

* Inngest
* Next.js API routes
* Prisma ORM

**AI**

* Google Gemini API

---

## 🔐 Security

* 🔒 Encrypted credentials at rest
* 🔓 Runtime decryption
* 🚫 No exposure in logs/UI

---

## ⚙️ Getting Started

```bash
git clone https://github.com/your-username/fluxion.git
cd fluxion
npm install
```

---

### 🔑 Environment Variables

```env
DATABASE_URL=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
ENCRYPTION_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

---

### ▶️ Run Locally

```bash
npm run dev
npx inngest-cli@latest dev
```

---

## 🌍 Production

* Deploy on Vercel
* Add env variables
* Sync Inngest
* Ensure `/api/inngest` is public

---

## 🚧 Roadmap

* 🧠 AI workflow generator
* 📦 More integrations (Notion, Gmail)
* 🔍 Advanced debugging panel
* 🔐 Role-based access

---

## 💼 Why This Project Matters

This is not a CRUD app.

Fluxion demonstrates:

* Event-driven systems
* Distributed workflow execution
* Secure secrets management
* AI-native product design

---

## 👨‍💻 Author

**Ansh Tripathi**

---

## ⭐ Support

If you like this project, give it a ⭐ and share it!

---

<p align="center">
  ⚡ Built to push the limits of AI automation
</p>
