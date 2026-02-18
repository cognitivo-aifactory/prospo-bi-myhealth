// TypeScript interfaces for chat functionality

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestedQuestions?: string[]; // Add suggested questions to message
  dashboardActions?: DashboardAction[]; // Add dashboard navigation actions
  queryResult?: QueryResultData; // Add query result data for table rendering
  userQuery?: string; // Store user's original query to detect intent
}

export interface QueryResultData {
  statementId: string;
  rowCount: number;
  columns?: string[];
  rows?: any[][];
  query?: string; // Store the SQL query to detect aggregations
  suggestedVisualization?: 'table' | 'chart'; // Hint from backend about best visualization
}

export interface DashboardAction {
  type: 'navigate' | 'filter' | 'highlight';
  dashboardId: string;
  label: string;
  description?: string;
}

export interface GenieRequest {
  message: string;
  conversationId?: string;
  currentDashboardId?: string; // Add context about current dashboard
}

export interface GenieResponse {
  id: string;
  content: string;
  conversationId: string;
  suggestedQuestions?: string[]; // Add suggested questions to response
  dashboardActions?: DashboardAction[]; // Add dashboard actions to response
  queryResult?: QueryResultData; // Add query result data
  metadata?: {
    queryExecutionTime?: number;
    dataSourcesUsed?: string[];
    relatedDashboards?: string[]; // Suggest related dashboards
  };
}

export type MessageStatus = 
  | 'SUBMITTED' 
  | 'FETCHING_METADATA' 
  | 'ASKING_AI' 
  | 'PENDING_WAREHOUSE'
  | 'EXECUTING_QUERY'
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export interface GenieConfig {
  databricksHost: string;
  databricksToken: string;
  genieSpaceId: string;
}