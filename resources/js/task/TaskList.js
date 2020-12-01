/* eslint-env browser */

import TaskView from "./TaskView.js";
import { Event, Observable } from "../utils/Observable.js";

var taskList,
    taskViews = [];

function clearList(context) {
    let completedTasks = taskViews.filter(function(view) {
        return view.isMarkedAsCompleted();
    });
    for (let i = 0; i < completedTasks.length; i++) {
        let taskEvent = new Event("taskDeletionRequest", completedTasks[i].getTask());
        context.notifyAll(taskEvent);
    }
}

function addTask(task, context) {
    let view = new TaskView(task);
    taskViews.push(view);
    taskList.appendChild(view.getElement());
    view.addEventListener("taskViewStatusChange", onTaskViewUpdated.bind(context));
    view.addEventListener("taskViewTextChange", onTaskViewUpdated.bind(context));
    view.focus();
}

function removeTask(task) {
    for (let i = 0; i < taskViews.length; i++) {
        let currentView = taskViews[i];
        if (currentView.getTask().id === task.id) {
            currentView.removeElement();
            taskViews.splice(i, 1);
            break;
        }
    }
}

function onTaskViewUpdated(event) {
    let taskEvent = new Event("taskViewUpdate", event.data);
    this.notifyAll(taskEvent);
}

class TaskList extends Observable {

    constructor(taskListEl) {
        super();
        taskList = taskListEl;
    }

    add(task) {
        addTask(task, this);
    }

    remove(task) {
        removeTask(task);
    }

    clear() {
        clearList(this);
    }

}

export default TaskList;