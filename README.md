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

## Building and Testing

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

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

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)
