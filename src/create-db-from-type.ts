import { Database } from "bun:sqlite";


type SQLiteType = 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB';

type ColumnDefinition = {
  name: string;
  type: SQLiteType;
  primaryKey?: boolean;
  notNull?: boolean;
  unique?: boolean;
};

function createTableStatement<T extends Record<string, any>>(
  tableName: string,
  columnDefinitions: ColumnDefinition[]
): string {
  const columns = columnDefinitions.map(column => {
    let columnDef = `${column.name} ${column.type}`;
    if (column.primaryKey) columnDef += ' PRIMARY KEY';
    if (column.notNull) columnDef += ' NOT NULL';
    if (column.unique) columnDef += ' UNIQUE';
    return columnDef;
  });

  return `CREATE TABLE ${tableName} (
  ${columns.join(',\n  ')}
);`;
}

// Type guard to check if a value is a valid SQLiteType
function isSQLiteType(type: any): type is SQLiteType {
  return ['TEXT', 'INTEGER', 'REAL', 'BLOB'].includes(type);
}

// Helper function to infer SQLite type from TypeScript type
function inferSQLiteType<T>(key: keyof T): SQLiteType {
  const typeofProperty = typeof {} as T[typeof key];
  switch (typeofProperty) {
    case 'string': return 'TEXT';
    case 'number': return 'INTEGER'; // You might want to differentiate between INTEGER and REAL based on your needs
    case 'boolean': return 'INTEGER';
    default:
      if ({} as T[typeof key] instanceof Date) return 'TEXT';
      if ({} as T[typeof key] instanceof Uint8Array) return 'BLOB';
      throw new Error(`Unsupported type for property ${String(key)}`);
  }
}

// Helper function to create column definitions from a type
function createColumnDefinitions<T extends Record<string, any>>(type: T): ColumnDefinition[] {
  return Object.keys(type).filter(key => !key.endsWith('PrimaryKey') && !key.endsWith('NotNull') && !key.endsWith('Unique')).map(key => {
    const columnDef: ColumnDefinition = {
      name: key,
      type: isSQLiteType(type[key]) ? type[key] : inferSQLiteType<T>(key as keyof T),
      primaryKey: !!type[`${key}PrimaryKey`],
      notNull: !!type[`${key}NotNull`],
      unique: !!type[`${key}Unique`]
    };
    return columnDef;
  });
}

// Example usage:
interface User {
  id: 'INTEGER';
  idPrimaryKey: true;
  username: 'TEXT';
  usernameNotNull: true;
  usernameUnique: true;
  email: 'TEXT';
  emailNotNull: true;
  age: 'INTEGER';
  isActive: 'INTEGER';
  createdAt: 'TEXT';
  profilePicture: 'BLOB';
}

// Usage
const userType: User = {
  id: 'INTEGER',
  idPrimaryKey: true,
  username: 'TEXT',
  usernameNotNull: true,
  usernameUnique: true,
  email: 'TEXT',
  emailNotNull: true,
  age: 'INTEGER',
  isActive: 'INTEGER',
  createdAt: 'TEXT',
  profilePicture: 'BLOB'
};

const columnDefinitions = createColumnDefinitions(userType);
const sqlStatement = createTableStatement('users', columnDefinitions);
console.log(sqlStatement);

const db=new Database("fake.db");

db.exec(sqlStatement);
