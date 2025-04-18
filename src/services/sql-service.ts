import * as sql from 'msnodesqlv8';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface SqlConnectionConfig {
  server?: string;
  database?: string;
  trustedConnection?: boolean;
  username?: string;
  password?: string;
}

export class SqlService {
  /**
   * Creates a connection string based on the provided configuration
   */    public static getConnectionString(): string {
    const server = process.env.DB_SERVER || '';
    const database = process.env.DB_DATABASE || '';
    const username = process.env.DB_USERNAME || '';
    const password = process.env.DB_PASSWORD || '';
    
    // For msnodesqlv8, we need to use the ODBC driver syntax
    const databasePart = database ? `Database=${database};` : '';
    
    // Try ODBC Driver 18 which might have better compatibility with your SQL Server version
    const connectionString = `Driver={ODBC Driver 17 for SQL Server};Server=${server};${databasePart}Uid=${username};Pwd=${password};TrustServerCertificate=Yes`;
    return connectionString;
  }

  /**
   * Executes a SQL query and returns the result
   */
  public static async executeQuery<T>(connectionString: string, query: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      sql.query(connectionString, query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as T[]);
      });
    });
  }
}

export default SqlService;