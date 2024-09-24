import type { SQLiteType } from "./types";

// Type guard to check if a value is a valid SQLiteType
// biome-ignore lint/suspicious/noExplicitAny: ignore
export function isSQLiteType(type: any): type is SQLiteType {
  return ["TEXT", "INTEGER", "REAL", "BLOB"].includes(type);
}

export function inferSQLiteType<T>(key: keyof T): SQLiteType {
  const typeofProperty = typeof {} as T[typeof key];
  switch (typeofProperty) {
    case "string":
      return "TEXT";
    case "number":
      return "INTEGER"; // You might want to differentiate between INTEGER and REAL based on your needs
    case "boolean":
      return "INTEGER";
    default:
      if (({} as T[typeof key]) instanceof Date) return "TEXT";
      if (({} as T[typeof key]) instanceof Uint8Array) return "BLOB";
      throw new Error(`Unsupported type for property ${String(key)}`);
  }
}
