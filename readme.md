# SES Email App

A powerful, serverless bulk email marketing platform built with React and AWS. This application leverages AWS SES (Simple Email Service) for reliable email delivery, AWS SAM for infrastructure management, and a modern React frontend for campaign tracking and contact management.

## 🚀 Features

- **Campaign Management**: Create, edit, and schedule bulk email campaigns.
- **Contact List Support**: Import contacts via CSV files.
- **Real-time Analytics**: Monitor email opens, clicks, bounces, and complaints.
- **Template System**: Manage and reuse email templates.
- **Credit/Balance System**: Integrated user balance for email sending.
- **Serverless Architecture**: Built for scalability and cost-efficiency using AWS Lambda, DynamoDB, SQS, and S3.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (for campaign statistics)
- **Routing**: React Router 7

### Backend (AWS Serverless)
- **IaC**: AWS SAM (Serverless Application Model)
- **Compute**: AWS Lambda (Python 3.11)
- **Database**: Amazon DynamoDB
- **Messaging**: Amazon SQS (Queued email dispatch)
- **Storage**: Amazon S3 (CSV uploads)
- **Email Delivery**: Amazon SES
- **API Gateway**: HTTP API with JWT Custom Authorizer

## 📁 Project Structure

```
SES/
├── src/                # Frontend source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application views (Dashboard, Campaigns, etc.)
│   ├── services/       # API interaction logic
│   ├── context/        # Global state management
│   ├── utils/          # Helper functions
│   └── App.jsx         # Main application entry
├── public/             # Static assets
├── template.yaml       # AWS SAM infrastructure template
└── package.json        # Frontend dependencies and scripts
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- AWS CLI configured with appropriate permissions
- AWS SAM CLI installed

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SES
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

### Backend Deployment

1. **Build the SAM application**:
   ```bash
   sam build
   ```

2. **Deploy to AWS**:
   ```bash
   sam deploy --guided
   ```

## 📊 Analytics Tracking

The app uses an SNS topic linked to SES Event Destinations to capture real-time feedback. Lambda functions process these events and update DynamoDB, providing immediate insights into campaign performance directly on the dashboard.

## 📄 License

This project is licensed under the MIT License.
