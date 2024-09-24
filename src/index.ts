import { Database } from "bun:sqlite";
import { Statement } from "./create-statement";

// Example usage:
type User = {
  id: "INTEGER";
  idPrimaryKey: true;
  username: "TEXT";
  usernameNotNull: true;
  usernameUnique: true;
  email: "TEXT";
  emailNotNull: true;
  age: "INTEGER";
  isActive: "INTEGER";
  createdAt: "TEXT";
  profilePicture: "BLOB";
};

// Usage
const userType: User = {
  id: "INTEGER",
  idPrimaryKey: true,
  username: "TEXT",
  usernameNotNull: true,
  usernameUnique: true,
  email: "TEXT",
  emailNotNull: true,
  age: "INTEGER",
  isActive: "INTEGER",
  createdAt: "TEXT",
  profilePicture: "BLOB",
};

const statement = new Statement<User>("users");

statement.setColumnDefinitions(userType);
const sqlStatement = statement.newCreateStatement();
const insertStatement = statement.newInsertStatement({
  ignored: {
    createdAt: true,
    profilePicture: true,
  },
});

console.log(insertStatement);

const db = new Database(":memory:");
db.exec(sqlStatement);

// const safeExec=makeSafeFunction(db.exec);

// safeExec(sqlStatement).match(console.log,console.error)
