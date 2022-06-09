import Logger from "../utils/Logger.js";
import Task from "../task/Task.js";
import Config from "./DBConfig.js";
import DBProvider from "./DBProvider.js";

var database;

function getObjectStore(mode) {
    let transaction = database.transaction([Config.DB_STORE_KEY], mode),
        objectStore = transaction.objectStore(Config.DB_STORE_KEY);
    return objectStore;
}

function callErrorCallback(msg, callback) {
    let error = new Error(msg);
    callback(error);
}

function createDatabase() {
    return new Promise(function(resolve, reject) {
        let request = indexedDB.open(Config.DB_NAME);
        request.onerror = callErrorCallback.bind(null,
            "Could not open database", reject);
        request.onupgradeneeded = function(event) {
            let db = event.target.result,
                objectStore = db.createObjectStore(Config.DB_STORE_KEY, {
                    keyPath: Config.DB_STORE_KEY_PATH,
                });
            objectStore.createIndex("id", "id");
        };
        request.onsuccess = function(event) {
            Logger.log("DB ready to use");
            database = event.target.result;
            resolve();
        };
    });
}

function storeTask(task) {
    return new Promise(function(resolve, reject) {
        let objectStore = getObjectStore("readwrite"),
            request = objectStore.add(task);
        request.onerror = callErrorCallback.bind(null,
            "Could not store task in database", reject);
        request.onsuccess = function() {
            Logger.log(`Task ${task.id} added to DB`);
            resolve(task);
        };
    });
}

function getAllTasksFromDatabase() {
    return new Promise(function(resolve, reject) {
        let objectStore = getObjectStore("readonly"),
            request = objectStore.getAll();
        request.onerror = callErrorCallback.bind(null,
            "Could not get tasks from database", reject);
        request.onsuccess = function(event) {
            let dbTasks = event.target.result,
                tasks = [];
            for (let i = 0; i < dbTasks.length; i++) {
                tasks.push(Task.fromObject(dbTasks[i]));
            }
            resolve(tasks);
        };
    });
}

function updateTaskInDatabase(task) {
    return new Promise(function(resolve, reject) {
        let objectStore = getObjectStore("readwrite"),
            request = objectStore.get(task.id);
        request.onerror = callErrorCallback.bind(null,
            "Could not get task from database", reject);
        request.onsuccess = function(event) {
            let updateRequest, dbTask = event.target.result;
            dbTask.description = task.description;
            dbTask.status = task.status;
            updateRequest = objectStore.put(dbTask);
            updateRequest.onerror = callErrorCallback.bind(null,
                "Could not update task in database", reject);
            updateRequest.onsuccess = function() {
                let newTask = Task.fromObject(dbTask);
                Logger.log(`Task ${task.id} updated in DB`);
                resolve(newTask);
            };
        };
    });
}

function removeTaskFromDatabase(task) {
    return new Promise(function(resolve, reject) {
        let transaction = database.transaction([Config.DB_STORE_KEY],
                "readwrite"),
            objectStore = transaction.objectStore(Config.DB_STORE_KEY),
            request = objectStore.delete(task.id);
        request.onerror = callErrorCallback.bind(null,
            "Could not remove task from database", reject);
        request.onsuccess = function() {
            Logger.log(`Task ${task.id} removed from DB`);
            resolve(task);
        };
    });
}

class IndexedDBManager extends DBProvider {

    async open() {
        return createDatabase();
    }

    async createTask() {
        let newTask = new Task();
        return storeTask(newTask);
    }

    async getTasks() {
        return getAllTasksFromDatabase();
    }

    async updateTask(task) {
        return updateTaskInDatabase(task);
    }

    async removeTask(task) {
        return removeTaskFromDatabase(task);
    }

}

export default IndexedDBManager;