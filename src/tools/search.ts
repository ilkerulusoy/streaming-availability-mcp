import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UserContext } from "../types";

export function registerSearchTool(server: McpServer, userContext: UserContext) {
  server.tool(
    "search", 
    "Search for content across various data sources", 
    {
      query: {
        type: "string",
        description: "The search query to find relevant content"
      },
      source: {
        type: "string", 
        description: "The data source to search in (e.g., 'documents', 'database', 'files')",
        enum: ["documents", "database", "files", "web", "knowledge_base"]
      },
      limit: {
        type: "number",
        description: "Maximum number of results to return (default: 10)",
        minimum: 1,
        maximum: 50
      }
    }, 
    async (args) => {
      const { query, source = "documents", limit = 10 } = args;
      
      // Simulate search functionality - replace with actual search logic
      const searchResults = await performSearch(query as string, source as string, limit as number, userContext);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              query,
              source,
              results: searchResults,
              total_results: searchResults.length,
              timestamp: new Date().toISOString()
            }, null, 2),
          },
        ],
      };
    }
  );
}

async function performSearch(query: string, source: string, limit: number, userContext: UserContext) {
  // This is a mock implementation - replace with actual search logic
  // You would integrate with your actual data sources here
  
  const mockResults = [
    {
      id: "doc_1",
      title: `Search result for "${query}" in ${source}`,
      content: `This is a mock search result for the query "${query}" from ${source}`,
      relevance_score: 0.95,
      url: `https://example.com/${source}/doc_1`,
      last_modified: "2024-12-19T10:00:00Z"
    },
    {
      id: "doc_2", 
      title: `Another result for "${query}"`,
      content: `This is another mock search result related to "${query}"`,
      relevance_score: 0.87,
      url: `https://example.com/${source}/doc_2`,
      last_modified: "2024-12-18T15:30:00Z"
    }
  ];
  
  // Filter based on user context if needed
  return mockResults.slice(0, limit).map(result => ({
    ...result,
    searched_by: userContext.userId
  }));
} 