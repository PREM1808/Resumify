# Resumify 🚀

Resumify is a full-stack web application designed to help organize, scan, and parse resumes. It features a robust Python/Django backend and a responsive front-end user interface.

The project code is fully complete, and we are currently working through database connection hurdles to get it live on the web.



## Project Directory

The workspace is organized with a clean separation between backend data processing and front-end user experience:

Resumify/
├── backend/            # Python & Django backend service
│   ├── api/            # API endpoints & database models
│   ├── core/           # Main project settings & configurations
│   ├── manage.py       # Local run command script
│   └── requirements.txt# Backend libraries & dependencies
├── frontend/           # React/Node.js user interface
└── README.md           # Project documentation



## Core Technology Stack

* Frontend: React.js with Vite
* Backend: Django 6.0.3 & Django REST Framework
* Local Environment: Python 3.14 (Local) → targeting Python 3.12 for production
* Database Support: TiDB Cloud (MySQL compatible) & Firebase
* AI Integration: Google Gemini API (for smart resume parsing)



## Challenges Encountered (Why Deployment is In-Progress)

During our trials to launch Resumify to the cloud (Render), we encountered database dependency roadlocks that we are currently troubleshooting:

### 1. The Cloud Free-Tier Pivot (Aiven to TiDB)

* The Challenge: We originally tried to create a free MySQL service on Aiven, but the free tier was locked due to high demand.
* The Solution: We successfully pivoted to TiDB Cloud (Singapore region) and created a serverless MySQL-compatible cluster.

### 2. Python Version Mismatch

* The Challenge: Our local code was built on experimental Python 3.14, but cloud hosts do not support library builds for this version yet.
* The Solution: We configured the target environment to use Python 3.12.2 to ensure stable library support.

### 3. The MySQL Driver Block (mysqlclient 2.2.1 required)

* The Challenge: This is our current roadblock. Django 6.0 demands a modern database driver (mysqlclient 2.2.1 or higher). However, free cloud servers often come with an outdated driver pre-installed on their Linux system. This mismatch causes a crash whenever the app tries to connect to our cloud database.
* Our Working Fix: We are implementing a "bridge" using the pymysql library to trick Django into accepting our database connection without needing the system's broken driver.


## Strategic Evaluation

### Strengths

* Decoupled Setup: The frontend and backend are independent, meaning changes to one won't break the other.
* Cost-Efficient: Relies entirely on free database tiers (TiDB Cloud) with zero hardware overhead.
* Modern Django Logic: Built using the latest Django 6 conventions.

### Weaknesses

* Deployment Roadblocks: The current backend database drivers require careful manual configuration to run smoothly on standard web servers.
* Local vs Cloud Discrepancy: Running Python 3.14 locally means we have to watch out for library differences when running Python 3.12 in production.

### Advantages

* AI-Ready: Fully prepared to parse resumes instantly using the Google Gemini API.
* Scalable Database: TiDB Cloud scales automatically, meaning our data can grow without crashing.



## Applications

* Student Portfolio Tool: Perfect for hosting a personal, interactive resume.
* Small Business HR Assistant: Can easily be adapted to help small teams upload, search, and manage candidate resumes.



## Future Enhancements

* Switch the database connector to PostgreSQL or SQLite if MySQL cloud drivers continue to conflict on free hosting platforms.
* Containerize the entire application using Docker so it deploys instantly on any server without driver issues.