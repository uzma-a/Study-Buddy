# 📘 Study Buddy

Study Buddy is a smart learning platform built with **React.js** (frontend) and **Clerk Authentication** for secure access.  
It helps students generate notes, summarize text, and track their learning progress on a personal **Dashboard**.  

---

## 🚀 Features

- 📝 **Notes Generator** – Generate well-structured notes on any topic.  
- 📖 **Summarizer** – Summarize long text into short, readable content.  
- 📊 **Dashboard** – Track your learning history & progress (**protected with Clerk Auth**).  
- 🔒 **Authentication with Clerk** – Users must **Sign In / Sign Up** before accessing private pages like Dashboard.  
- 🎨 **Modern UI** – Responsive design with **dark/light mode toggle**.  
- 📱 **Mobile Friendly** – Includes mobile navigation with a smooth menu experience.  

---

## 🛠️ Tech Stack

- **Frontend:** React.js + Tailwind CSS  
- **Authentication:** [Clerk](https://clerk.com/) (Sign In / Sign Up / User Management)  
- **Routing:** react-router-dom  
- **State Management:** React Context API (Auth Context for login state)  
- **PDF Export (optional):** jsPDF / custom utils  
- **Deployment:** Vercel / Netlify  

---

## 📂 Project Structure

study-buddy/
│── public/
│── src/
│ ├── assets/ # Images, icons, static files
│ ├── components/ # Reusable components
│ │ ├── DarkModeToggle.jsx
│ │ ├── Footer.jsx
│ │ ├── Navbar.jsx
│ │ ├── Notes.jsx
│ │ ├── Quiz.jsx
│ │ ├── Summarizer.jsx
│ │ └── Tabs.jsx
│ ├── pages/ # Page-level components
│ │ ├── About.jsx
│ │ └── Dashboard.jsx # Protected with Clerk
│ ├── utils/ # Helper functions
│ │ ├── api.js
│ │ └── pdfExport.js
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
│
│── .env # Clerk API keys
│── index.html
│── package.json
│── vite.config.js
│── README.md