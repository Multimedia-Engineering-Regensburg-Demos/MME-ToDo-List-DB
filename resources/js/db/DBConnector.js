/* eslint-env browser */

import IndexedDBProvider from "./IndexedDBProvider.js";
import Task from "../task/Task.js";

function getProvider(strategy) {
  switch (strategy) {
    case DBConnector.INDEXED_DB_STRATEGY:
      return new IndexedDBProvider();
    default:
      throw new Error("Strategy");
  }
}

class DBConnector {

  constructor(strategy) {
    this.db = getProvider(strategy);
  }

  open() {
    return this.db.open();
  }

  createTask() {
    let newTask = new Task();
    return this.db.createTask(newTask);
  }

  getTasks() {
    return this.db.getTasks();
  }

  updateTask(task) {
    return this.db.updateTask(task);
  }

  removeTask(task) {
    return this.db.removeTask(task);
  }

}

DBConnector.INDEXED_DB_STRATEGY = Symbol("IndexedDB");
DBConnector.LOCALSTORAGE_STRATEGY = Symbol("LocalStorage");

export default DBConnector;