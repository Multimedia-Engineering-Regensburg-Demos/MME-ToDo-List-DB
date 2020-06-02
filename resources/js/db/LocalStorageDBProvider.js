/* eslint-env browser */

import Logger from "../utils/Logger.js";
import Task from "../task/Task.js";
import Config from "./DBConfig.js";
import DBProvider from "./DBProvider.js";

let liveData = [];

function loadLiveDataFromStorage() {
    let jsonString = localStorage.getItem(Config.DB_NAME) || "[]",
        taskObjects = JSON.parse(jsonString);
    liveData = [];
    for (let i = 0; i < taskObjects.length; i++) {
        liveData.push(Task.fromObject(taskObjects[i]));
    }
    Logger.log("Live data initialized with state from local storage");
}

function saveLiveDataToStorage() {
    let jsonString = JSON.stringify(liveData);
    localStorage.setItem(Config.DB_NAME, jsonString);
    Logger.log("Live data saved to local storage");
}

function storeTask(task) {
    liveData.push(task);
    Logger.log(`Task ${task.id} added to DB`);
    saveLiveDataToStorage();
}

function findTaskById(id) {
    for (let i = 0; i < liveData.length; i++) {
        if (liveData[i].id === id) {
            return liveData[i];
        }
    }
    return undefined;
}

function updateTaskInDB(updatedTask) {
    let oldTask = findTaskById(updatedTask.id);
    if (oldTask) {
        oldTask.description = updatedTask.description;
        oldTask.status = updatedTask.status;
    }
    saveLiveDataToStorage();
    Logger.log(`Task ${oldTask.id} updated in DB`);
    return oldTask;
}

function removeTaskFromDB(taskToBeRemoved) {
    let removedTask;
    for (let i = 0; i < liveData.length; i++) {
        if (liveData[i].id === taskToBeRemoved.id) {
            removedTask = liveData.splice(i, 1)[0];
            saveLiveDataToStorage();
            break;
        }
    }
    Logger.log(`Task ${removedTask.id} removed from DB`);
    return removedTask;
}


class LocalStorageDBProvider extends DBProvider {

    open() {
        return new Promise(function (resolve, reject) {
            loadLiveDataFromStorage();
            resolve();
        });
    }

    createTask() {
        return new Promise(function (resolve, reject) {
            let newTask = new Task();
            storeTask(newTask);
            resolve(newTask);
        });
    }

    getTasks() {
        return new Promise(function (resolve, reject) {
            resolve(liveData);
        });
    }

    updateTask(task) {
        return new Promise(function (resolve, reject) {
            let updatedTask = updateTaskInDB(task);
            resolve(updatedTask);
        });
    }

    removeTask(task) {
        return new Promise(function (resolve, reject) {
            let removedTask = removeTaskFromDB(task);
            resolve(removedTask);
        });
    }

}

export default LocalStorageDBProvider;