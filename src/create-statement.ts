import type { ColumnDefinition } from "./types";
import { inferSQLiteType, isSQLiteType } from "./utils";

export class Statement<T extends Record<string, unknown>> {
  declare type: T;
  declare tableName: string;
  columnDefinitions: ColumnDefinition[] | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  setColumnDefinitions(userType: T) {
    if (this.columnDefinitions === null) {
      this.columnDefinitions = this.createColumnDefinitions(userType);
    }
  }

  newCreateStatement() {
    if (this.columnDefinitions === null) {
      throw new Error("No column defintions set. Call setColumnDefintions");
    }

    if (!this.columnDefinitions) throw new Error("No column definitions set");

    const columns = this.columnDefinitions.map((column) => {
      let columnDef = `${column.name} ${column.type}`;
      if (column.primaryKey) columnDef += " PRIMARY KEY";
      if (column.notNull) columnDef += " NOT NULL";
      if (column.unique) columnDef += " UNIQUE";
      return columnDef;
    });

    const statement = `CREATE TABLE ${this.tableName} (
        ${columns.join(",\n  ")}
    );`;

    console.info({
      module: "sqlite-gen",
      status: "Running statement",
      statement,
    });

    return statement;
  }

  newInsertStatement({ ignored }: { ignored?: Ignored<T> }) {
    if (!this.columnDefinitions) throw new Error("No column definitions set");

    const keys = Object.keys(ignored || {});

    if (ignored)
      console.log({
        module: "sqlite-gen",
        message: "ignoring selected fields",
        ignored: keys,
      });

    const columns = this.columnDefinitions
      .filter((column) => !keys.find((key) => key === column.name))
      .map((column) => `${column.name}`);

    const statement = `INSERT INTO ${this.tableName} (${columns.join(",\n  ")}) VALUES (${columns.map((v) => "?")})`;

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

type Ignored<T> = {
  [K in keyof T]?: boolean;
};
