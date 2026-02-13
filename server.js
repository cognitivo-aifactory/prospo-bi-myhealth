const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Enable CORS for React app
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
// Databricks configuration - use REACT_APP_ prefix for backend compatibility
const DATABRICKS_HOST = process.env.VITE_DATABRICKS_HOST || process.env.REACT_APP_DATABRICKS_HOST;
const DATABRICKS_TOKEN = process.env.VITE_DATABRICKS_TOKEN || process.env.REACT_APP_DATABRICKS_TOKEN;
const GENIE_SPACE_ID = process.env.VITE_GENIE_SPACE_ID || process.env.REACT_APP_GENIE_SPACE_ID;

// Create axios instance for Databricks
const databricksApi = axios.create({
  baseURL: DATABRICKS_HOST,
  headers: {
    'Authorization': `Bearer ${DATABRICKS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Proxy endpoint: Start conversation
app.post('/api/genie/start-conversation', async (req, res) => {
  try {
    const response = await databricksApi.post(
      `/api/2.0/genie/spaces/${GENIE_SPACE_ID}/start-conversation`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error starting conversation:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to start conversation' }
    });
  }
});

// Proxy endpoint: Send message to existing conversation
app.post('/api/genie/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const response = await databricksApi.post(
      `/api/2.0/genie/spaces/${GENIE_SPACE_ID}/conversations/${conversationId}/messages`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to send message' }
    });
  }
});

// Proxy endpoint: Get message status
app.get('/api/genie/conversations/:conversationId/messages/:messageId', async (req, res) => {
  try {
    const { conversationId, messageId } = req.params;
    const response = await databricksApi.get(
      `/api/2.0/genie/spaces/${GENIE_SPACE_ID}/conversations/${conversationId}/messages/${messageId}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error getting message:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to get message' }
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Genie proxy server running on http://localhost:${PORT}`);
  console.log(`Databricks Host: ${DATABRICKS_HOST}`);
  console.log(`Genie Space ID: ${GENIE_SPACE_ID}`);
});