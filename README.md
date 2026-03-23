# Portfolio Generator

A full-stack web application that converts `.docx` resumes into responsive, personal portfolio websites. Built using C#, .NET, React, and TypeScript, this project focuses on automating content transformation and streamlining portfolio creation.

---

## 📌 Overview

Portfolio Generator is designed to eliminate the manual effort of building a personal website by automatically transforming resume data into structured, styled web content.

The application parses semi-structured `.docx` files, extracts relevant information, and dynamically generates a responsive portfolio layout. It demonstrates full-stack development, API design, and backend data processing.

---

## ✨ Key Features

- Upload and process `.docx` resumes
- Extract and transform semi-structured data into structured formats
- Generate responsive HTML/CSS portfolio layouts
- Live preview of generated portfolio content
- RESTful API for document processing and data transformation
- Full-stack architecture with React frontend and C# backend
- Cloud-ready deployment with Azure

---

## 🧠 Architecture Overview

The application follows a client-server architecture with clear separation of concerns:

- **Frontend (React + TypeScript)**  
  Handles file upload, user interaction, and live preview rendering

- **Backend (.NET / C#)**  
  Processes `.docx` files, extracts structured data, and returns formatted content via APIs

- **API Layer**  
  RESTful endpoints handle communication between frontend and backend services

- **Data Transformation Layer**  
  Converts semi-structured resume content into normalized data models for rendering

The system is designed to be modular and extensible, allowing support for additional formats or customization features.

---

## 🔄 Data Processing Flow

1. User uploads a `.docx` resume
2. Backend parses document content
3. Extracted data is transformed into structured models
4. API returns formatted data
5. Frontend renders a live preview of the generated portfolio

---

## 🛠️ Technologies Used

- **Languages:** C#, TypeScript, JavaScript
- **Frontend:** React
- **Backend:** .NET
- **Architecture:** REST APIs
- **Cloud/DevOps:** Azure App Services, GitHub Actions
- **Data Processing:** Document parsing and transformation

---

## 🚀 Live Demo

https://portfoliocreator-hwemcghrh5axesey.canadacentral-01.azurewebsites.net/

---

## ⚙️ Getting Started

### Prerequisites

- .NET SDK
- Node.js & npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/felker12/your-repo-name.git
```

### Backend Setup

```bash
cd backend
dotnet restore
dotnet run
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 💡 Design Highlights
- Designed backend services to parse and transform semi-structured `.docx` data into structured formats for dynamic rendering
- Implemented a data transformation pipeline (parse → normalize → render) to handle inconsistent resume formats
- Separated concerns between UI, API, and processing layers to support scalability and future extensibility
- Built the system to support future template-based rendering and export features


## 🔮 Future Improvements
Support for multiple portfolio templates and themes
Export generated portfolios as static deployable sites
Enhanced parsing for different resume formats
User customization and editing tools

📄 License

This project is for educational and portfolio purposes.
