import Logger from "./utils/Logger.js";
import TaskList from "./task/TaskList.js";
import DBConnector from "./db/DBConnector.js";

var db,
    taskList;

async function init() {
    Logger.enable();
    try {
        await initDatabase(DBConnector.INDEXED_DB_STRATEGY);
        let tasks = await db.getTasks();
        initUI(tasks);
    } catch (error) {
        Logger.log(error);
    }
}

async function initDatabase(strategy) {
    db = new DBConnector(strategy);
    await db.open(true);
    return true;
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