/*eslint-env browser */

import Logger from "./utils/Logger.js";
import DBManager from "./db/DBManager.js";
import TaskController from "./task/TaskController.js";

function init() {
  Logger.enable();
  initDatabase().then(initTaskController).catch(function(error) {
    Logger.log(error);
  });
}

function initDatabase() {
  return new Promise(function(resolve, reject) {
    DBManager.open(true).then(function() {
      DBManager.getTasks().then(function(result) {
        resolve(result);
      });
    }).catch(function(error) {
      reject(error);
    });
  });
}

function initTaskController(tasks) {
  for (let i = 0; i < tasks.length; i++) {
    TaskController.add(tasks[i]);
  }
  TaskController.addEventListener("taskRequest", onTaskRequested);
  TaskController.addEventListener("taskViewUpdate", onTaskViewUpdated);
  TaskController.addEventListener("taskDeletionRequest",
    onTaskDeletionRequested);
}

function onTaskRequested() {
  DBManager.createTask().then(TaskController.add.bind(TaskController));
}

function onTaskViewUpdated(event) {
  DBManager.updateTask(event.data);
}

function onTaskDeletionRequested(event) {
  DBManager.removeTask(event.data).then(TaskController.remove.bind(
    TaskController));
}

init();