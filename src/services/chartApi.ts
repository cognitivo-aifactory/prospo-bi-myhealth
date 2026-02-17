import axios from 'axios';
import type { ChartConfig, TableMetadata } from '../types/chart.types';

const API_BASE = import.meta.env.VITE_PROXY_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

export const chartApi = {
  // Execute a query and get results
  async executeQuery(query: string): Promise<any[]> {
    const response = await api.post('/api/databricks/query', { query });
    return response.data.result?.data_array || [];
  },

  // Get table metadata
  async getTableMetadata(catalog: string, schema: string, table: string): Promise<TableMetadata> {
    const response = await api.get('/api/databricks/table-metadata', {
      params: { catalog, schema, table }
    });
    return response.data;
  },

  // List catalogs
  async getCatalogs(): Promise<string[]> {
    const response = await api.get('/api/databricks/catalogs');
    return response.data;
  },

  // List schemas
  async getSchemas(catalog: string): Promise<string[]> {
    const response = await api.get('/api/databricks/schemas', {
      params: { catalog }
    });
    return response.data;
  },

  // List tables
  async getTables(catalog: string, schema: string): Promise<string[]> {
    const response = await api.get('/api/databricks/tables', {
      params: { catalog, schema }
    });
    return response.data;
  },

  // Get chart data based on config
  async getChartData(config: ChartConfig): Promise<any[]> {
    const response = await api.post('/api/charts/data', { config });
    return response.data;
  },

  // Save chart configuration
  async saveChart(config: ChartConfig): Promise<ChartConfig> {
    const response = await api.post('/api/charts', config);
    return response.data;
  },

  // Get saved charts
  async getCharts(): Promise<ChartConfig[]> {
    const response = await api.get('/api/charts');
    return response.data;
  },
};
