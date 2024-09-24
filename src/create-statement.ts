import type { ColumnDefinition } from "./types";
import { inferSQLiteType, isSQLiteType } from "./utils";

export class Statement<T extends Record<string, unknown>> {
  declare type: T;
  declare tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  newCreateStatement(userType: T) {
    const columnDefinitions = this.createColumnDefinitions(userType);

    return this.createTableStatement(this.tableName, columnDefinitions);
  }

  newInsertStatement() {}

  createTableStatement<T extends Record<string, unknown>>(
    tableName: string,
    columnDefinitions: ColumnDefinition[],
  ): string {
    const columns = columnDefinitions.map((column) => {
      let columnDef = `${column.name} ${column.type}`;
      if (column.primaryKey) columnDef += " PRIMARY KEY";
      if (column.notNull) columnDef += " NOT NULL";
      if (column.unique) columnDef += " UNIQUE";
      return columnDef;
    });

    const statement = `CREATE TABLE ${tableName} (
        ${columns.join(",\n  ")}
    );`;

    console.info({
      module: "sqlite-gen",
      statement,
      status: "Running statement",
    });

    return statement;
  }

  createColumnDefinitions<T extends Record<string, unknown>>(
    type: T,
  ): ColumnDefinition[] {
    console.info({
      module: "sqlite-gen",
      status: "generating column defintions",
      type,
    });
    return Object.keys(type)
      .filter(
        (key) =>
          !key.endsWith("PrimaryKey") &&
          !key.endsWith("NotNull") &&
          !key.endsWith("Unique"),
      )
      .map((key) => {
        const columnDef: ColumnDefinition = {
          name: key,
          type: isSQLiteType(type[key])
            ? type[key]
            : inferSQLiteType<T>(key as keyof T),
          primaryKey: !!type[`${key}PrimaryKey`],
          notNull: !!type[`${key}NotNull`],
          unique: !!type[`${key}Unique`],
        };
        return columnDef;
      });
  }
}
