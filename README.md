# sql-mcp-server

A Model Context Protocol (MCP) server built with mcp-framework for SQL Server database interactions.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Project Structure

```
sql-mcp-server/
├── src/
│   ├── services/       # Services for the application
│   │   └── sql-service.ts
│   ├── tools/          # MCP Tools
│   │   ├── execute-select-query-tool.ts
│   │   ├── get-database-schema-tool.ts
│   │   └── get-databases-tool.ts
│   └── index.ts        # Server entry point
├── .env                # Environment configuration
├── package.json
└── tsconfig.json
```

## Available Tools

The project comes with several SQL-focused tools:

1. **get-databases-tool** - Lists available databases on the SQL Server
2. **get-database-schema-tool** - Retrieves schema information for specified databases
3. **execute-select-query-tool** - Runs parameterized SELECT queries against the database

## SQL Service

The `SqlService` class provides core functionality for:

- Creating connection strings using environment variables
- Executing queries against SQL Server databases

## Environment Configuration

Configure your database connection in the `.env` file:

```
DB_SERVER=localhost\SQLEXPRESS
DB_DATABASE=AdventureWorks2019
DB_USERNAME=readonly_user
DB_PASSWORD=StrongPassword!123
DB_PORT=1433
```

### AdventureWorks Sample Database

This project uses the AdventureWorks sample database. You can download and install it from:
- [Microsoft Docs: Install and Configure AdventureWorks](https://learn.microsoft.com/en-us/sql/samples/adventureworks-install-configure?view=sql-server-ver16&tabs=ssms)

Follow the instructions on the Microsoft documentation page to download the database backup file and restore it to your SQL Server instance.

### Creating a Read-Only User

To create a read-only user for SQL Server that the application can use:

```sql
-- Create a new login and user in master database
CREATE LOGIN readonly_user WITH PASSWORD = 'StrongPassword!123';
GO

-- Switch to your target database
USE AdventureWorks2019;
GO

-- Add the user to the db_datareader role for read-only access
ALTER ROLE db_datareader ADD MEMBER readonly_user;
GO
```

> Note: You'll need to create the SQL Server login first using SQL Server Management Studio or with the `CREATE LOGIN` command before running these commands.

## Using with VS Code

You can configure the MCP server to run within VS Code by following these steps:

1. **Create an `.vscode/mcp.json` file in your project:**
   - Create a directory named `.vscode` in your project root if it doesn't exist
   - Create a file named `mcp.json` inside the `.vscode` directory with the following content:

```json
{
  "servers": {
    "sql-mcp-server": {
      "url": "http://localhost:1337/mcp"
    }
  }
}
```

## Building and Testing

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

## Debugging

You can debug your MCP server using the `mcp-debug` tool:

```bash
# Start the server in one terminal
npm start

# In another terminal, run mcp-debug
npx mcp-debug
```

The `mcp-debug` tool provides a CLI interface to:
- List available tools on your MCP server
- Execute tools with specific parameters
- View the full responses from your server

This helps you test your tools before integrating them with an LLM application. For more information, see the [MCP Framework HTTP Quickstart](https://mcp-framework.com/docs/http-quickstart/#testing-your-http-server).

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)
