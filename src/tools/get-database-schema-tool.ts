// filepath: c:\Users\PrahveenT\Documents\Projects\AI\weather-http-server\src\tools\get-database-schema-tool.ts
import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { SqlService } from "../services/sql-service.js";

interface GetDatabaseSchemaInput {
  tables?: string[];
  schemas?: string[];
}

interface ColumnInfo {
  Name: string;
  Type: string;
  Nullable: boolean;
  IsPrimaryKey: boolean;
  IsForeignKey: boolean;
  MaxLength?: number;
  Precision?: number;
  Scale?: number;
  IsIdentity: boolean;
}

interface TableInfo {
  Name: string;
  Schema: string;
  Columns: ColumnInfo[];
}

class GetDatabaseSchemaTool extends MCPTool<GetDatabaseSchemaInput> {
  name = "getDatabaseSchema";
  description = "Retrieves schema information from a specified database";

  schema = {
    tables: {
      type: z.array(z.string()).optional(),
      description: "Optional list of specific tables to retrieve schema for",
    },
    schemas: {
      type: z.array(z.string()).optional(),
      description: "Optional list of specific schemas to retrieve schema for",
    }
  };

  async execute(input: GetDatabaseSchemaInput) {
    try {
      // Get connection string using SqlService
      const connectionString = SqlService.getConnectionString();
     
      // Build the filter conditions
      const tableFilter = input.tables && input.tables.length > 0
        ? `AND t.name IN (${input.tables.map(t => `'${t}'`).join(',')})`
        : "";
      
      const schemaFilter = input.schemas && input.schemas.length > 0
        ? `AND s.name IN (${input.schemas.map(s => `'${s}'`).join(',')})`
        : "";

      // Define the SQL query for detailed table and column information
      const query = `
        SELECT 
          t.name AS TableName,
          s.name AS SchemaName,
          c.name AS ColumnName,
          ty.name AS DataTypeName,
          c.max_length AS MaxLength,
          c.precision AS Precision,
          c.scale AS Scale,
          c.is_nullable AS IsNullable,
          c.is_identity AS IsIdentity,
          CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END AS IsPrimaryKey,
          CASE WHEN fk.parent_column_id IS NOT NULL THEN 1 ELSE 0 END AS IsForeignKey
        FROM 
          sys.tables t
          INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
          INNER JOIN sys.columns c ON t.object_id = c.object_id
          INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
          LEFT JOIN (
            SELECT 
              ic.column_id,
              ic.object_id
            FROM 
              sys.indexes i
              INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
            WHERE 
              i.is_primary_key = 1
          ) pk ON c.object_id = pk.object_id AND c.column_id = pk.column_id
          LEFT JOIN sys.foreign_key_columns fk ON c.object_id = fk.parent_object_id AND c.column_id = fk.parent_column_id
        WHERE 
          t.type = 'U' ${tableFilter} ${schemaFilter}
        ORDER BY 
          s.name, t.name, c.column_id
      `;

      // Execute the query using SqlService
      interface SchemaRow {
        TableName: string;
        SchemaName: string;
        ColumnName: string;
        DataTypeName: string;
        MaxLength: number;
        Precision: number;
        Scale: number;
        IsNullable: boolean;
        IsIdentity: boolean;
        IsPrimaryKey: number;
        IsForeignKey: number;
      }
      
      const rows = await SqlService.executeQuery<SchemaRow>(connectionString, query);
      
      // Dictionary to group columns by table
      const tableDict: Record<string, TableInfo> = {};
      
      rows.forEach(row => {
        const tableName = row.TableName;
        const schemaName = row.SchemaName;
        const tableKey = `${schemaName}.${tableName}`;
        
        // Create or get table info
        if (!tableDict[tableKey]) {
          tableDict[tableKey] = {
            Name: tableName,
            Schema: schemaName,
            Columns: []
          };
        }
        
        // Add column info
        tableDict[tableKey].Columns.push({
          Name: row.ColumnName,
          Type: row.DataTypeName,
          MaxLength: row.MaxLength,
          Precision: row.Precision,
          Scale: row.Scale,
          Nullable: Boolean(row.IsNullable),
          IsIdentity: Boolean(row.IsIdentity),
          IsPrimaryKey: row.IsPrimaryKey === 1,
          IsForeignKey: row.IsForeignKey === 1
        });
      });
      
      const result = Object.values(tableDict);
      return { tables: result };
      
    } catch (error) {      
      console.error('SQL Server connection error:', error);
      return {
        error: "Failed to retrieve database schema",
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

export default GetDatabaseSchemaTool;
