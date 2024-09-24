import { Database } from "bun:sqlite";
import { createColumnDefinitions, createTableStatement } from "./create-db-from-type";

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
