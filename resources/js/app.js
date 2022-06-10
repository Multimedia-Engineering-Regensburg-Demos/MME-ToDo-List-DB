import TaskListView from "/resources/js/ui/TaskListView.js";
import DBConnector from "/resources/js/db/DBConnector.js";
import Logger from "/resources/js/utils/Logger.js";

var databaseConnector,
    taskListView;

async function initDatabase(strategy) {
    databaseConnector = new DBConnector(strategy);
    await databaseConnector.open(true);
    return true;
}

async function initUserInterface() {
    let tasks = await databaseConnector.getAllTasks();
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

async function onTaskCleanupRequested(event) {
    for (let i = 0; i < event.data.length; i++) {
        await databaseConnector.removeTask(event.data[i]);
        taskListView.remove(event.data[i]);
    }
}

Logger.enable();
await initDatabase(DBConnector.INDEXED_DB_STRATEGY);
await initUserInterface();