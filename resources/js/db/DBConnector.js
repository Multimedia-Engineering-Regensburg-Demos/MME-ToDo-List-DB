import LocalStorageDBProvider from "/resources/js/db/providers/localstorage/LocalStorageDBProvider.js";
import IndexedDBProvider from "/resources/js/db/providers/indexeddb/IndexedDBProvider.js";

function getProvider(strategy) {
    switch (strategy) {
        case DBConnector.LOCAL_STORAGE_STRATEGY:
            return new LocalStorageDBProvider();
        case DBConnector.INDEXED_DB_STRATEGY:
            return new IndexedDBProvider();
        default:
            throw new Error("Unknown Strategy");
    }
}

class DBConnector {

    constructor(strategy) {
        this.db = getProvider(strategy);
    }

    async open() {
        return this.db.open();
    }

    async createTask() {
        return this.db.createTask();
    }

    async getAllTasks() {
        return this.db.getTasks();
    }

    async updateTask(task) {
        return this.db.updateTask(task);
    }

    async removeTask(task) {
        return this.db.removeTask(task);
    }

}

DBConnector.INDEXED_DB_STRATEGY = Symbol("IndexedDB");
DBConnector.LOCAL_STORAGE_STRATEGY = Symbol("LocalStorage");

export default DBConnector;