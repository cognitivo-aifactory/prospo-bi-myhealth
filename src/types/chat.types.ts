// TypeScript interfaces for chat functionality

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  suggestedQuestions?: string[]; // Add suggested questions to message
  dashboardActions?: DashboardAction[]; // Add dashboard navigation actions
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
  metadata?: {
    queryExecutionTime?: number;
    dataSourcesUsed?: string[];
    relatedDashboards?: string[]; // Suggest related dashboards
  };
}

export interface GenieConfig {
  databricksHost: string;
  databricksToken: string;
  genieSpaceId: string;
}