import axios, { AxiosInstance } from 'axios';
import { GenieRequest, GenieResponse, GenieConfig } from '../types/chat.types';

/**
 * Service class for interacting with Databricks Genie API
 * Uses the official Databricks Genie Conversation API
 * Documentation: https://learn.microsoft.com/en-us/azure/databricks/genie/conversation-api
 */
class GenieApiService {
  private axiosInstance: AxiosInstance;
  private config: GenieConfig;

  constructor() {
    // Load configuration from environment variables (Vite way)
    this.config = {
      databricksHost: import.meta.env.VITE_DATABRICKS_HOST || '',
      databricksToken: import.meta.env.VITE_DATABRICKS_TOKEN || '',
      genieSpaceId: import.meta.env.VITE_GENIE_SPACE_ID || '',
    };

    // Use proxy server to avoid CORS issues
    // Use relative URL so it works in any environment (local, AWS, etc.)
    const proxyUrl = import.meta.env.VITE_PROXY_URL || '';

    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: proxyUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 second timeout for Genie queries
    });
  }

  /**
   * Send a message to Genie and get a response
   * @param request - The message request
   * @param onStatusUpdate - Optional callback for status updates during polling
   * @returns Promise with Genie's response
   */
  async sendMessage(
    request: GenieRequest,
    onStatusUpdate?: (status: string) => void
  ): Promise<GenieResponse> {
    try {
      let conversationId: string;
      let messageId: string;

      // Start a new conversation or continue existing one
      if (!request.conversationId) {
        // Start new conversation (using proxy)
        const startResponse = await this.axiosInstance.post(
          `/api/genie/start-conversation`,
          {
            content: request.message,
          }
        );

        conversationId = startResponse.data.conversation.id;
        messageId = startResponse.data.message.id;
      } else {
        // Continue existing conversation (using proxy)
        conversationId = request.conversationId;
        const messageResponse = await this.axiosInstance.post(
          `/api/genie/conversations/${conversationId}/messages`,
          {
            content: request.message,
          }
        );

        messageId = messageResponse.data.id;
      }

      // Poll for the message completion
      const messageDetails = await this.pollForCompletion(conversationId, messageId, onStatusUpdate);

      // Extract response content and suggested questions
      const responseData = this.extractResponseContent(messageDetails);

      // Extract query result if available
      let queryResult;
      if (responseData.queryAttachment) {
        queryResult = await this.fetchQueryResult(
          conversationId,
          responseData.queryAttachment.query.statement_id
        );
      }

      return {
        id: messageId,
        content: responseData.content,
        conversationId: conversationId,
        suggestedQuestions: responseData.suggestedQuestions,
        queryResult: queryResult,
        metadata: {
          queryExecutionTime: messageDetails.query_result?.duration_ms,
          dataSourcesUsed: messageDetails.attachments?.map((a: any) => a.query?.query),
        },
      };
    } catch (error: any) {
      console.error('Error calling Genie API:', error);
      
      if (error.response) {
        // API returned an error response
        throw new Error(
          `Genie API Error: ${error.response.data?.message || error.response.statusText}`
        );
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from Genie API. Please check your network connection.');
      } else {
        // Something else happened
        throw new Error(`Failed to get response from Genie AI: ${error.message}`);
      }
    }
  }

  /**
   * Poll for message completion status
   * Polls every 2 seconds with exponential backoff up to 10 minutes
   */
  private async pollForCompletion(
    conversationId: string,
    messageId: string,
    onStatusUpdate?: (status: string) => void,
    maxAttempts: number = 300 // 10 minutes with 2 second intervals
  ): Promise<any> {
    let attempts = 0;
    let delay = 2000; // Start with 2 seconds

    while (attempts < maxAttempts) {
      const response = await this.axiosInstance.get(
        `/api/genie/conversations/${conversationId}/messages/${messageId}`
      );

      const status = response.data.status;

      // Notify status update
      if (onStatusUpdate) {
        onStatusUpdate(status);
      }

      if (status === 'COMPLETED') {
        return response.data;
      } else if (status === 'FAILED' || status === 'CANCELLED') {
        throw new Error(
          `Query ${status.toLowerCase()}: ${response.data.error?.message || 'Unknown error'}`
        );
      }

      // Wait before next poll (exponential backoff, max 60 seconds)
      await this.sleep(delay);
      delay = Math.min(delay * 1.5, 60000);
      attempts++;
    }

    throw new Error('Query timeout: Genie took too long to respond');
  }

  /**
   * Extract readable response content from message details
   */
  private extractResponseContent(messageDetails: any): { 
    content: string; 
    suggestedQuestions?: string[];
    queryAttachment?: any;
  } {
    let content = '';
    let suggestedQuestions: string[] | undefined;
    let queryAttachment: any;

    // Try to get text response from attachments
    if (messageDetails.attachments && messageDetails.attachments.length > 0) {
      // Extract text content
      const textAttachment = messageDetails.attachments.find(
        (a: any) => a.text && a.text.content
      );
      
      if (textAttachment) {
        content = textAttachment.text.content;
      }

      // Extract suggested questions
      const suggestedAttachment = messageDetails.attachments.find(
        (a: any) => a.suggested_questions && a.suggested_questions.questions
      );
      
      if (suggestedAttachment && suggestedAttachment.suggested_questions.questions) {
        suggestedQuestions = suggestedAttachment.suggested_questions.questions;
      }

      // Extract query attachment for table data
      queryAttachment = messageDetails.attachments.find((a: any) => a.query);

      // If no text, show query info
      if (!content && queryAttachment) {
        content = `Query executed successfully. SQL: ${queryAttachment.query.query}`;
      }
    }

    // Fallback to content field
    if (!content) {
      content = messageDetails.content || 'Response received but no content available.';
    }

    return { content, suggestedQuestions, queryAttachment };
  }

  /**
   * Fetch query result data from statement execution
   */
  private async fetchQueryResult(conversationId: string, statementId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `/api/genie/conversations/${conversationId}/query-result/${statementId}`
      );

      return {
        statementId: statementId,
        rowCount: response.data.row_count || 0,
        columns: response.data.columns,
        rows: response.data.rows,
      };
    } catch (error) {
      console.error('Error fetching query result:', error);
      return null;
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.databricksHost &&
      this.config.databricksToken &&
      this.config.genieSpaceId
    );
  }

  /**
   * Helper method to sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const genieApi = new GenieApiService();