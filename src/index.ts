import { Database } from "bun:sqlite";
import { createColumnDefinitions, createTableStatement } from "./create-db-from-type";

// Example usage:
type User={
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
} ;

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


const db=new Database(":memory:");
const changes=db.exec(sqlStatement);

console.log({changes});

// const safeExec=makeSafeFunction(db.exec);

// safeExec(sqlStatement).match(console.log,console.error)