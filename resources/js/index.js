/*eslint-env browser */

import Logger from "./utils/Logger.js";
import TaskController from "./task/TaskController.js";

function init() {
  Logger.enable();
  // TODO: Create or open DB and get all tasks
  // TODO: Init TaskController with available tasks
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