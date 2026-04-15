<div align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/master/icons/django.svg" width="100" height="100" alt="Django Logo" />
  <h1>🚀 BizLedger</h1>
  <p><b>The Ultimate Multi-Tenant SaaS Financial Engine</b></p>

  <p>
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
    <img src="https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white" />
  </p>
</div>

---

## 📖 Overview
**BizLedger** is a full-stack, enterprise-ready financial management system. Designed as a **Multi-Tenant SaaS**, it allows businesses to manage invoices, track expenses, and generate real-time financial reports with zero friction.

### 🏗️ Architecture at a Glance


---

## 🔥 Core Features

<details>
<summary><b>🛡️ Multi-Tenancy & Security</b></summary>
- Secure data isolation for each business.
- JWT-based stateless authentication.
- Role-based access control (RBAC).
</details>

<details>
<summary><b>⚡ High-Performance Background Tasks</b></summary>
- **Celery & Redis** integration for heavy lifting.
- Async Invoice PDF generation.
- Automated email triggers for payment reminders.
</details>

<details>
<summary><b>📊 Financial Intelligence</b></summary>
- Dynamic Dashboard with revenue/expense graphs.
- Tenant-specific financial reporting.
- Real-time tax and profit calculations.
</details>

---

## 🛠️ Technical Stack

- **Backend:** Python 3.12, Django 5.x, Django Rest Framework.
- **Frontend:** React + Vite, Tailwind CSS.
- **Database:** PostgreSQL (with Docker volumes).
- **Messaging:** Redis (Broker) + Celery (Worker).
- **DevOps:** Docker Compose for seamless orchestration.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
Make sure you have **Docker Desktop** installed.

### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/Tashif-Toor/BizLedger.git](https://github.com/Tashif-Toor/BizLedger.git)

# Move into the project
cd BizLedger

# Start the entire ecosystem
docker-compose up --build
