
# MyDashboard - MyHealth with Genie AI Integration

A modern healthcare dashboard with integrated Databricks Genie AI chatbot for intelligent data analysis.

This is a code bundle for MyDashboard - MyHealth. The original project is available at https://www.figma.com/design/e1UZcqRI1xmYA2PAJdVaEH/MyDashboard---MyHealth.

## Features

- **Interactive Dashboards**: Practice, Practitioner, and Management views
- **Genie AI Integration**: Real-time AI-powered data analysis and insights
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Databricks workspace with Genie enabled
- Databricks personal access token

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Databricks credentials:
   ```
   VITE_DATABRICKS_HOST=https://your-workspace.cloud.databricks.com
   VITE_DATABRICKS_TOKEN=your-databricks-token
   VITE_GENIE_SPACE_ID=your-genie-space-id
   VITE_PROXY_URL=http://localhost:3001
   ```

3. **Get your Databricks credentials:**
   - **Host**: Your Databricks workspace URL (from browser address bar)
   - **Token**: Generate from User Settings > Access Tokens > Generate New Token
   - **Genie Space ID**: Found in your Databricks Genie dashboard

## Running the Application

**Option 1: Run both frontend and backend together (recommended):**
```bash
npm run dev:full
```

**Option 2: Run separately:**

Terminal 1 (Backend proxy server):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend proxy: http://localhost:3001

## Genie AI Features

- **Natural Language Queries**: Ask questions about your data in plain English
- **Real-time Analysis**: Get instant insights from your healthcare data
- **Suggested Questions**: AI provides follow-up questions based on context
- **Conversation History**: Maintains context across multiple questions
- **Error Handling**: Graceful handling of API errors and timeouts

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js proxy server for Databricks API
- **AI Integration**: Databricks Genie Conversation API
- **Styling**: Tailwind CSS with custom theme

## Troubleshooting

### Common Issues

1. **"Databricks credentials not configured"**
   - Ensure your `.env` file exists and contains valid credentials
   - Check that environment variables are properly set

2. **"No response from Genie API"**
   - Verify your Databricks token is valid and not expired
   - Check that your Genie Space ID is correct
   - Ensure the proxy server is running on port 3001

3. **CORS errors**
   - The proxy server handles CORS issues automatically
   - Make sure both frontend and backend are running

### Getting Help

- Check the browser console for detailed error messages
- Verify your Databricks workspace has Genie enabled
- Ensure your access token has the necessary permissions
  