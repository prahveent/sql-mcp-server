// filepath: c:\Users\PrahveenT\Documents\Projects\AI\weather-http-server\src\tools\execute-select-query-tool.ts
import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SqlService } from "../services/sql-service.js";

interface ExecuteSelectQueryInput {
  query: string;
  parameters?: Record<string, string | number | boolean | null>;
}

class ExecuteSelectQueryTool extends MCPTool<ExecuteSelectQueryInput> {
  name = "executeSelectQuery";
  description = "Executes a parameterized SELECT query against the database";

  schema = {
    query: {
      type: z.string(),
      description: "The SELECT query to execute. Must begin with SELECT."
    },
    parameters: {
      type: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
      description: "Optional parameters to use in the query. Use @paramName in the query and provide values here."
    },
  };

  async execute(input: ExecuteSelectQueryInput) {
    try {
      // Validate query is a SELECT statement
      const trimmedQuery = input.query.trim();
      if (!trimmedQuery.toUpperCase().startsWith('SELECT ')) {
        return {
          error: "Invalid query",
          message: "Only SELECT queries are allowed for security reasons"
        };
      }

      // Apply row limit if specified
      let finalQuery = trimmedQuery;
     
      // Get connection string
      const connectionString = SqlService.getConnectionString();

      // Execute the query using SqlService
      const result = await SqlService.executeQuery(connectionString, finalQuery);
      
      return { 
        success: true,
        rowCount: result.length,
        data: result
      };
      
    } catch (error) {
      console.error('SQL query execution error:', error);
      return {
        error: "Failed to execute query",
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

export default ExecuteSelectQueryTool;
