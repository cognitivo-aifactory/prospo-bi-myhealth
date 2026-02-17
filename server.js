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
// Databricks configuration - use REACT_APP_ prefix for backend compatibility
const DATABRICKS_HOST = process.env.VITE_DATABRICKS_HOST || process.env.REACT_APP_DATABRICKS_HOST;
const DATABRICKS_TOKEN = process.env.VITE_DATABRICKS_TOKEN || process.env.REACT_APP_DATABRICKS_TOKEN;
const DATABRICKS_WAREHOUSE_ID = process.env.VITE_DATABRICKS_WAREHOUSE_ID || process.env.REACT_APP_DATABRICKS_WAREHOUSE_ID;
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

// Chart Builder API Endpoints

// Start a SQL Warehouse
app.post('/api/databricks/warehouses/:warehouseId/start', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    
    console.log(`Starting warehouse: ${warehouseId}`);
    
    const response = await databricksApi.post(`/api/2.0/sql/warehouses/${warehouseId}/start`);
    
    res.json({ 
      message: 'Warehouse starting...', 
      warehouse_id: warehouseId,
      note: 'It may take 30-60 seconds to fully start'
    });
  } catch (error) {
    console.error('Error starting warehouse:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to start warehouse' }
    });
  }
});

// Stop a SQL Warehouse
app.post('/api/databricks/warehouses/:warehouseId/stop', async (req, res) => {
  try {
    const { warehouseId } = req.params;
    
    console.log(`Stopping warehouse: ${warehouseId}`);
    
    const response = await databricksApi.post(`/api/2.0/sql/warehouses/${warehouseId}/stop`);
    
    res.json({ 
      message: 'Warehouse stopping...', 
      warehouse_id: warehouseId 
    });
  } catch (error) {
    console.error('Error stopping warehouse:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to stop warehouse' }
    });
  }
});

// List available SQL Warehouses (helpful for finding the correct ID)
app.get('/api/databricks/warehouses', async (req, res) => {
  try {
    if (!DATABRICKS_HOST || !DATABRICKS_TOKEN) {
      return res.status(500).json({
        error: { 
          message: 'Missing Databricks configuration. Check VITE_DATABRICKS_HOST and VITE_DATABRICKS_TOKEN in .env file' 
        }
      });
    }

    const response = await databricksApi.get('/api/2.0/sql/warehouses');
    const warehouses = response.data.warehouses?.map(w => ({
      id: w.id,
      name: w.name,
      state: w.state,
      cluster_size: w.cluster_size,
      warehouse_type: w.warehouse_type
    })) || [];
    
    res.json(warehouses);
  } catch (error) {
    console.error('Error listing warehouses:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to list warehouses' }
    });
  }
});

// Test Databricks connection
app.post('/api/databricks/test-connection', async (req, res) => {
  try {
    if (!DATABRICKS_HOST || !DATABRICKS_TOKEN || !DATABRICKS_WAREHOUSE_ID) {
      return res.status(500).json({
        error: { 
          message: 'Missing Databricks configuration. Check VITE_DATABRICKS_HOST, VITE_DATABRICKS_TOKEN, and VITE_DATABRICKS_WAREHOUSE_ID in .env file' 
        }
      });
    }

    const response = await databricksApi.get('/api/2.0/sql/warehouses/' + DATABRICKS_WAREHOUSE_ID);
    res.json({ 
      status: 'connected', 
      warehouse: response.data.name,
      warehouse_id: response.data.id,
      state: response.data.state
    });
  } catch (error) {
    console.error('Connection test failed:', error.response?.data || error.message);
    
    // If warehouse not found, suggest listing available warehouses
    if (error.response?.status === 404 || error.response?.data?.error_code === 'RESOURCE_DOES_NOT_EXIST') {
      return res.status(404).json({
        error: {
          message: `SQL Warehouse '${DATABRICKS_WAREHOUSE_ID}' does not exist. Run 'curl http://localhost:3001/api/databricks/warehouses' to see available warehouses.`,
          error_code: 'WAREHOUSE_NOT_FOUND',
          warehouse_id: DATABRICKS_WAREHOUSE_ID
        }
      });
    }
    
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to connect to Databricks' }
    });
  }
});

// Execute SQL query
app.post('/api/databricks/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: { message: 'Query is required' } });
    }

    console.log('Executing query:', query);

    // Execute statement
    const response = await databricksApi.post('/api/2.0/sql/statements', {
      statement: query,
      warehouse_id: DATABRICKS_WAREHOUSE_ID,
      wait_timeout: '30s',
      on_wait_timeout: 'CONTINUE'
    });

    const statementId = response.data.statement_id;
    let result = response.data;

    // Poll for results if not immediately available
    if (result.status.state === 'PENDING' || result.status.state === 'RUNNING') {
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollResponse = await databricksApi.get(`/api/2.0/sql/statements/${statementId}`);
        result = pollResponse.data;
        
        if (result.status.state === 'SUCCEEDED') {
          break;
        } else if (result.status.state === 'FAILED' || result.status.state === 'CANCELED') {
          throw new Error(result.status.error?.message || 'Query failed');
        }
      }
    }

    if (result.status.state !== 'SUCCEEDED') {
      throw new Error('Query timeout');
    }

    // Transform result to array of objects
    const columns = result.manifest?.schema?.columns || [];
    const data = result.result?.data_array || [];
    
    const transformedData = data.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col.name] = row[idx];
      });
      return obj;
    });

    res.json(transformedData);
  } catch (error) {
    console.error('Error executing query:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: error.message || 'Failed to execute query' }
    });
  }
});

// Get catalogs
app.get('/api/databricks/catalogs', async (req, res) => {
  try {
    const response = await databricksApi.get('/api/2.1/unity-catalog/catalogs');
    const catalogs = response.data.catalogs?.map(c => c.name) || [];
    res.json(catalogs);
  } catch (error) {
    console.error('Error fetching catalogs:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to fetch catalogs' }
    });
  }
});

// Get schemas
app.get('/api/databricks/schemas', async (req, res) => {
  try {
    const { catalog } = req.query;
    if (!catalog) {
      return res.status(400).json({ error: { message: 'Catalog parameter is required' } });
    }

    const response = await databricksApi.get(`/api/2.1/unity-catalog/schemas`, {
      params: { catalog_name: catalog }
    });
    const schemas = response.data.schemas?.map(s => s.name) || [];
    res.json(schemas);
  } catch (error) {
    console.error('Error fetching schemas:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to fetch schemas' }
    });
  }
});

// Get tables
app.get('/api/databricks/tables', async (req, res) => {
  try {
    const { catalog, schema } = req.query;
    if (!catalog || !schema) {
      return res.status(400).json({ error: { message: 'Catalog and schema parameters are required' } });
    }

    const response = await databricksApi.get(`/api/2.1/unity-catalog/tables`, {
      params: { catalog_name: catalog, schema_name: schema }
    });
    const tables = response.data.tables?.map(t => t.name) || [];
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to fetch tables' }
    });
  }
});

// Get table metadata
app.get('/api/databricks/table-metadata', async (req, res) => {
  try {
    const { catalog, schema, table } = req.query;
    if (!catalog || !schema || !table) {
      return res.status(400).json({ error: { message: 'Catalog, schema, and table parameters are required' } });
    }

    const response = await databricksApi.get(
      `/api/2.1/unity-catalog/tables/${catalog}.${schema}.${table}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching table metadata:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to fetch table metadata' }
    });
  }
});

// Get chart data based on configuration
app.post('/api/charts/data', async (req, res) => {
  try {
    const { config } = req.body;
    let query = '';

    if (config.dataSource.type === 'query') {
      query = config.dataSource.customQuery;
    } else {
      // Build query from configuration
      const { catalog, schema, table } = config.dataSource;
      const { xAxis, yAxis } = config.dimensions;
      
      query = `SELECT ${xAxis}, ${yAxis} FROM ${catalog}.${schema}.${table}`;
      
      if (config.filters && config.filters.length > 0) {
        const whereClause = config.filters
          .map(f => `${f.field} ${f.operator} '${f.value}'`)
          .join(' AND ');
        query += ` WHERE ${whereClause}`;
      }
      
      if (config.limit) {
        query += ` LIMIT ${config.limit}`;
      }
    }

    // Execute the query using the same logic as /api/databricks/query
    const response = await databricksApi.post('/api/2.0/sql/statements', {
      statement: query,
      warehouse_id: DATABRICKS_WAREHOUSE_ID,
      wait_timeout: '30s',
      on_wait_timeout: 'CONTINUE'
    });

    const statementId = response.data.statement_id;
    let result = response.data;

    // Poll for results
    if (result.status.state === 'PENDING' || result.status.state === 'RUNNING') {
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollResponse = await databricksApi.get(`/api/2.0/sql/statements/${statementId}`);
        result = pollResponse.data;
        
        if (result.status.state === 'SUCCEEDED') break;
        if (result.status.state === 'FAILED' || result.status.state === 'CANCELED') {
          throw new Error(result.status.error?.message || 'Query failed');
        }
      }
    }

    if (result.status.state !== 'SUCCEEDED') {
      throw new Error('Query timeout');
    }

    // Transform result
    const columns = result.manifest?.schema?.columns || [];
    const data = result.result?.data_array || [];
    
    const transformedData = data.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col.name] = row[idx];
      });
      return obj;
    });

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching chart data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: 'Failed to fetch chart data' }
    });
  }
});

// In-memory storage for charts (replace with database in production)
let charts = [];

// Save chart
app.post('/api/charts', async (req, res) => {
  try {
    const chart = {
      ...req.body,
      id: req.body.id || `chart_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    charts.push(chart);
    res.json(chart);
  } catch (error) {
    console.error('Error saving chart:', error);
    res.status(500).json({ error: { message: 'Failed to save chart' } });
  }
});

// Get all charts
app.get('/api/charts', async (req, res) => {
  try {
    res.json(charts);
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ error: { message: 'Failed to fetch charts' } });
  }
});

// Get single chart
app.get('/api/charts/:id', async (req, res) => {
  try {
    const chart = charts.find(c => c.id === req.params.id);
    if (!chart) {
      return res.status(404).json({ error: { message: 'Chart not found' } });
    }
    res.json(chart);
  } catch (error) {
    console.error('Error fetching chart:', error);
    res.status(500).json({ error: { message: 'Failed to fetch chart' } });
  }
});

// Delete chart
app.delete('/api/charts/:id', async (req, res) => {
  try {
    charts = charts.filter(c => c.id !== req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chart:', error);
    res.status(500).json({ error: { message: 'Failed to delete chart' } });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from React app (only after API routes)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route for React app (must be last)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('App not built yet. Run: npm run build');
  }
});

app.listen(PORT, () => {
  console.log(`Genie proxy server running on http://localhost:${PORT}`);
  console.log(`Databricks Host: ${DATABRICKS_HOST}`);
  console.log(`Databricks Warehouse ID: ${DATABRICKS_WAREHOUSE_ID}`);
  console.log(`Genie Space ID: ${GENIE_SPACE_ID}`);
  
  if (!DATABRICKS_HOST || !DATABRICKS_TOKEN) {
    console.warn('⚠️  WARNING: Databricks credentials not configured!');
    console.warn('   Set VITE_DATABRICKS_HOST and VITE_DATABRICKS_TOKEN in .env file');
  }
  
  if (!DATABRICKS_WAREHOUSE_ID) {
    console.warn('⚠️  WARNING: Databricks Warehouse ID not configured!');
    console.warn('   Set VITE_DATABRICKS_WAREHOUSE_ID in .env file for Chart Builder');
  }
});