// filepath: c:\Users\PrahveenT\Documents\Projects\AI\weather-http-server\src\tools\get-databases-tool.ts
import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SqlService } from "../services/sql-service.js";

interface GetDatabasesInput {
  filter?: string;
  server?: string;
}

class GetDatabasesTool extends MCPTool<GetDatabasesInput> {
  name = "getDatabases";
  description = "Retrieves a list of available databases from MSSQL Server";

  schema = {
    filter: {
      type: z.string().optional(),
      description: "Optional filter to narrow down database results",
    },
    server: {
      type: z.string().optional(),
      description: "Optional server name (defaults to local)"
    }
  };

  async execute(input: GetDatabasesInput) {
    try {
      // Get connection string using SqlService
      const connectionString = SqlService.getConnectionString();

      // Define the SQL query
      const query = `
        SELECT name
        FROM sys.databases
        WHERE database_id > 4 -- Filter out system databases (master, model, msdb, tempdb)
        ORDER BY name;
      `;
      
      // Execute the query using SqlService
      interface DatabaseResult {
        name: string;
      }
      
      const result = await SqlService.executeQuery<DatabaseResult>(connectionString, query);
      
      // Extract just the database names from the result
      const databases = result ? result.map(record => record.name) : [];
      
      // Apply filter if provided
      if (input.filter && databases.length > 0) {
        const filterLower = input.filter.toLowerCase();
        return databases.filter(name => 
          name.toLowerCase().includes(filterLower)
        );
      }
      
      return databases;
      
    } catch (error) {      
      console.error('SQL Server connection error:', error);
      return {
        error: "Failed to retrieve databases",
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

export default GetDatabasesTool;
