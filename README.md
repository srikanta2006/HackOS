# 🚀 HackOS: The Hackathon Operating System

![HackOS Banner](https://via.placeholder.com/1200x300.png?text=HackOS+-+The+Hackathon+Operating+System)

<p align="center">
  <b>Build Faster, Together.</b><br>
  All-in-one platform for hackathon teams to collaborate, create, and conquer.
</p>

<p align="center">
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Built%20with-Vite-blue?logo=vite" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React-blue?logo=react" /></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Backend-Firebase-orange?logo=firebase" /></a>
  <a href="https://groq.com/"><img src="https://img.shields.io/badge/AI-Groq%20(Llama%203)-purple" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" /></a>
</p>

---

## 🧭 Overview

**HackOS** is the all-in-one platform designed to eliminate the common pain points of **team formation**, **tool fragmentation**, and **project management** during high-pressure hackathons.  
We centralize communication, tasks, design, and research into one **secure, real-time workspace** — so you can focus on what truly matters: **building.**

---

## 📦 Status

- **Current Version:** 1.0 (MVP+)
- **Deployment:** Live via [Vercel](https://vercel.com)
- **Database & Auth:** Firebase (Cloud Firestore + Authentication)
- **AI Engine:** Groq (Llama 3)
- **License:** MIT

---

## ✨ Key Features

HackOS moves beyond basic collaboration by integrating **professional-grade, specialized tools** into a single workflow.

### 🧩 1. Advanced Collaboration Workspace

The **private workspace** is the heart of HackOS, featuring:

- 💬 **Team Chat (Real-time, Custom Built):**  
  Chat built on Firestore with Markdown support and threaded replies — no external APIs.

- ✅ **Task Hub (Hybrid Kanban):**  
  Track project progress with either a **built-in Kanban board** or **Trello integration**.

- 🧠 **AI Research Panel:**  
  A lightning-fast research assistant powered by **Groq (Llama 3)**.  
  Saved answers are automatically shared with your team.

- 🛠️ **Design Hub:**  
  A nested tab system for specialized creative tools:
  - **UI/UX:** Embed live Figma design files.  
  - **System Design:** Integrate diagrams from Draw.io / Lucidchart.  
  - **Pitch Deck:** Embed Google Slides / Canva presentations.

- 📚 **Knowledge Base:**  
  Store and embed Google Docs or Notion pages for quick access to resources and notes.

---

### 🔐 2. Focus Mode & Security

- ⏱️ **Hackathon Lock:**  
  Once the team lead starts the hackathon timer, HackOS enters *Focus Mode* — blocking all public pages and redirecting users to their active workspace.

- 🏆 **Task Progress Bar:**  
  Displays real-time project completion based on the number of tasks moved to the “Done” column.

- 🔒 **Managed Teams:**  
  Users must request to join a team, and only the **Team Lead** can approve or reject membership requests.

---

### 👤 3. User & Portfolio Management

- **Dual-Mode Profiles:**  
  Editable “My Profile” view + public `/user/:id` portfolio view.

- **Automated Portfolio Generation:**  
  After project submission, HackOS auto-publishes the project details (Project Name, Hackathon, Team Members, Final Description, and Demo Link) to each member’s portfolio.

- **Social Sign-In:**  
  Supports **Email/Password**, **Google**, and **GitHub** authentication.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js (Vite) |
| **Backend** | Firebase (Firestore + Auth) |
| **AI Integration** | Groq (Llama 3) |
| **Deployment** | Vercel |
| **Styling** | Tailwind CSS |
| **Project Management** | Trello API (Optional Integration) |
| **Design Embeds** | Figma, Draw.io, Lucidchart, Canva, Google Slides |
| **Documentation** | Notion / Google Docs Integration |

---

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/hcp-frontend.git
cd hcp-frontend

```
## 2. Install Dependencies

```bash
yarn install
# OR
npm install
```
## 3. Setup Environment Variables
**Create a .env.local file in the project root and add your Groq API key:**
```bash
VITE_GROQ_API_KEY=gsk_YOUR_KEY_HERE
```
## 4. Run Locally
```bash
yarn dev
# OR
npm run dev
```

## 🌐 Deployment & Hosting

HackOS is configured for **continuous deployment via Vercel**, optimized for the **Vite** build system.

### ⚠️ Important Deployment Note

If deploying to a new domain (e.g., `hackos.app`),  
you must whitelist it in **Firebase Console → Authentication → Settings → Authorized Domains**  
to prevent `auth/unauthorized-domain` errors for Google/GitHub sign-in.

## 🧑‍💻 Contributing

We welcome contributions from **developers**, **designers**, and **hackers** worldwide!  

To contribute:

### 🪜 Steps

**Step 1:** Fork the repository  

**Step 2:** Create a new branch  
```bash
git checkout -b feature/your-feature-name
```
**Step 3:** Make changes & commit
```bash
git commit -m "Added new feature"
```
**Step 4:** Push to your branch
```bash
git push origin feature/your-feature-name
```
**Step 5:** Open a Pull Request 🚀

## 🗺️ Roadmap

- 🧠 Add integrated whiteboard for brainstorming  
- 💬 Support Discord and Devpost integrations  
- 🎥 Implement real-time video room for team sync  
- 🤖 Add AI-assisted pitch deck generator  
- 🚀 Introduce “Hackathon Discovery” section

## ❤️ Made with love for hackers who build under pressure.

