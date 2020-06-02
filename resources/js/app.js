/*eslint-env browser */

import Logger from "./utils/Logger.js";
import TaskList from "./task/TaskList.js";
import DBConnector from "./db/DBConnector.js";

var db,
  taskList;

function init() {
  Logger.enable();
  initDatabase().then(initUI).catch(function(error) {
    Logger.log(error);
  });
}

function initDatabase() {  
  db = new DBConnector(DBConnector.INDEXED_DB_STRATEGY);
  return new Promise(function(resolve, reject) {
    db.open(true).then(function() {
      db.getTasks().then(function(result) {
        resolve(result);
      });
    }).catch(function(error) {   
      reject(error);
    });
  });
}

function initUI(tasks) {
  let createTaskButton = document.querySelector(".button.new-task"),
    clearListButton = document.querySelector(".button.clear-list"),
    taskListEl = document.querySelector(".task-list");
  createTaskButton.addEventListener("click", onNewTaskButtonClicked);
  clearListButton.addEventListener("click", onClearListButtonClicked);
  taskList = new TaskList(taskListEl);
  taskList.addEventListener("taskViewUpdate", onTaskChangedByUser);
  taskList.addEventListener("taskDeletionRequest", onTaskDeletionRequested);
  for (let i = 0; i < tasks.length; i++) {
    taskList.add(tasks[i]);
  }
}

function onNewTaskButtonClicked() {
  db.createTask().then(taskList.add.bind(taskList));
}

function onClearListButtonClicked() {
  taskList.clear();

}

function onTaskChangedByUser(event) {
  db.updateTask(event.data);
}

function onTaskDeletionRequested(event) {
  db.removeTask(event.data).then(taskList.remove.bind(
    taskList));
}

init();