import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UserContext } from "../types";

export function registerFetchTool(server: McpServer, userContext: UserContext) {
  server.tool(
    "fetch", 
    "Fetch specific content by ID or URL from various data sources", 
    {
      identifier: {
        type: "string",
        description: "The ID, URL, or identifier of the content to fetch"
      },
      type: {
        type: "string",
        description: "The type of identifier being used",
        enum: ["id", "url", "path", "reference"]
      },
      source: {
        type: "string", 
        description: "The data source to fetch from (e.g., 'documents', 'database', 'files')",
        enum: ["documents", "database", "files", "web", "knowledge_base", "api"]
      },
      format: {
        type: "string",
        description: "The desired format of the returned content",
        enum: ["json", "text", "html", "markdown", "raw"]
      }
    }, 
    async (args) => {
      const { identifier, type = "id", source = "documents", format = "json" } = args;
      
      // Simulate fetch functionality - replace with actual fetch logic
      const fetchedContent = await performFetch(
        identifier as string, 
        type as string, 
        source as string, 
        format as string, 
        userContext
      );
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              identifier,
              type,
              source,
              format,
              content: fetchedContent,
              timestamp: new Date().toISOString()
            }, null, 2),
          },
        ],
      };
    }
  );
}

async function performFetch(
  identifier: string, 
  type: string, 
  source: string, 
  format: string, 
  userContext: UserContext
) {
  // This is a mock implementation - replace with actual fetch logic
  // You would integrate with your actual data sources here
  
  const mockContent = {
    id: identifier,
    title: `Content fetched from ${source}`,
    content: `This is mock content fetched using ${type}: "${identifier}" from ${source}`,
    metadata: {
      source,
      type,
      format,
      fetched_by: userContext.userId,
      fetched_at: new Date().toISOString(),
      size: "1.2KB",
      mime_type: getMimeType(format),
      permissions: ["read"],
      version: "1.0"
    },
    data: generateMockData(format, identifier)
  };

  // Format the content based on the requested format
  switch (format) {
    case "text":
      return mockContent.content;
    case "html":
      return `<div><h1>${mockContent.title}</h1><p>${mockContent.content}</p></div>`;
    case "markdown":
      return `# ${mockContent.title}\n\n${mockContent.content}`;
    case "raw":
      return mockContent.data;
    default:
      return mockContent;
  }
}

function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    json: "application/json",
    text: "text/plain",
    html: "text/html", 
    markdown: "text/markdown",
    raw: "application/octet-stream"
  };
  return mimeTypes[format] || "application/json";
}

function generateMockData(format: string, identifier: string) {
  // Generate different mock data based on format
  switch (format) {
    case "json":
      return { example: "data", id: identifier, items: [1, 2, 3] };
    case "text":
      return `Plain text content for ${identifier}`;
    case "html":
      return `<p>HTML content for ${identifier}</p>`;
    case "markdown":
      return `## Markdown content for ${identifier}`;
    default:
      return `Raw data for ${identifier}`;
  }
} 