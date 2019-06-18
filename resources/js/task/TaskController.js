/* eslint-env browser */

import TaskView from "./TaskView.js";
import { Event, Observable } from "../utils/Observable.js";

var taskList,
  taskViews = [];

function onNewTaskRequested() {
  let event = new Event("taskRequest");
  this.notifyAll(event);
}

function onListCleanupRequested() {
  let completedTasks = taskViews.filter(function(view) {
    return view.isMarkedAsCompleted();
  });
  for (let i = 0; i < completedTasks.length; i++) {
    let taskEvent = new Event("taskDeletionRequest", completedTasks[i].getTask());
    this.notifyAll(taskEvent);
  }
}

function onTaskViewUpdated(event) {
  let taskEvent = new Event("taskViewUpdate", event.data.getTask());
  this.notifyAll(taskEvent);
}

class TaskController extends Observable {

  constructor() {
    super();
    let createTaskButton = document.querySelector(".button.new-task"),
      clearListButton = document.querySelector(".button.clear-list");
    taskList = document.querySelector(".task-list");
    createTaskButton.addEventListener("click", onNewTaskRequested.bind(this));
    clearListButton.addEventListener("click", onListCleanupRequested.bind(this));
  }

  // Displays task (as TaskView) in UI
  add(task) {
    let view = new TaskView(task);
    taskViews.push(view);
    taskList.appendChild(view.getElement());
    view.addEventListener("taskViewStatusChange", onTaskViewUpdated.bind(this));
    view.addEventListener("taskViewTextChange", onTaskViewUpdated.bind(this));
    view.setFocus();
  }

  // Removes task (respectively its TaskView) from UI
  remove(task) {
    for (let i = 0; i < taskViews.length; i++) {
      let currentView = taskViews[i];
      if (currentView.getTask().id === task.id) {
        currentView.removeElement();
        taskViews.splice(i, 1);
        break;
      }
    }
  }

}

export default new TaskController();