export type ColumnDefinition = {
  name: string;
  type: SQLiteType;
  primaryKey?: boolean;
  notNull?: boolean;
  unique?: boolean;
};

export type SQLiteType = "TEXT" | "INTEGER" | "REAL" | "BLOB";
