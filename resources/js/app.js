import Task from "/resources/js/task/Task.js";
import TaskListView from "/resources/js/ui/TaskListView.js";
import Logger from "/resources/js/utils/Logger.js";

var taskListView;

async function initUserInterface() {
    let tasks = [];
    // TODO Pass all known tasks from database to list view
    taskListView = new TaskListView(document.querySelector("#tasks"));
    taskListView.addEventListener("newTaskRequested", onNewTaskRequested);
    taskListView.addEventListener("taskCleanupRequested", onTaskCleanupRequested);
    tasks.forEach(task => {
        task.addEventListener("update", (event) => onTaskUpdated(event.data));
        taskListView.add(task);
    });
}

async function onTaskUpdated(task) {
    // TODO Update task in database before re-rendering
    taskListView.update(task);
}

async function onNewTaskRequested() {
    let task = new Task();
    // TODO Get new task from database instead
    task.addEventListener("update", (event) => onTaskUpdated(event.data));
    taskListView.add(task);
}

async function onTaskCleanupRequested(event) {
    for (let i = 0; i < event.data.length; i++) {
        // TODO Delete tasks from database before removing views from UI
        taskListView.remove(event.data[i]);
    }
}

Logger.enable();
// TODO Connect to database with selected strategy before initializing user interface
await initUserInterface();