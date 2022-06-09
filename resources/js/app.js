import TaskListView from "./task/TaskListView.js";
import DBConnector from "./db/DBConnector.js";
import Logger from "./utils/Logger.js";

var databaseConnector,
    taskListView;

async function initDatabase(strategy) {
    databaseConnector = new DBConnector(strategy);
    await databaseConnector.open(true);
    return true;
}

async function initUserInterface() {
    let tasks = await databaseConnector.getTasks();
    taskListView = new TaskListView(document.querySelector("#tasks"));
    taskListView.addEventListener("newTaskRequested", onNewTaskRequested);
    taskListView.addEventListener("taskCleanupRequested", onTaskCleanupRequested);
    tasks.forEach(task => {
        task.addEventListener("update", (event) => onTaskUpdated(event.data));
        taskListView.add(task);
    });
}

async function onTaskUpdated(task) {
    await databaseConnector.updateTask(task);
    // Make sure that actual state from database is shown in UI
    taskListView.update(task);
}

async function onNewTaskRequested() {
    let task = await databaseConnector.createTask();
    task.addEventListener("update", (event) => onTaskUpdated(event.data));
    taskListView.add(task);
}

function onTaskCleanupRequested() {
    throw new Error("Not implemented!");
}

Logger.enable();
await initDatabase(DBConnector.INDEXED_DB_STRATEGY);
await initUserInterface();