class DBProvider {

    /*
     * Must return promise which resolves when database is ready
     */
    async open() {
        throw new Error("Not implemented");
    }

    /*
     * Must return promise which resolves with new task when that task was created and stored in database 
     */
    async createTask() {
        throw new Error("Not implemented");
    }

    /*
     * Must return promise which resolves when with all available tasks
     */
    async getTasks() {
        throw new Error("Not implemented");
    }

    /*
     * Must return promise which resolves with updated task when given task was updated in database
     */
    async updateTask(task) {
        throw new Error("Not implemented");
    }

    /*
     * Must return promise which resolves with removed task when that task was removed from database
     */
    async removeTask(task) {
        throw new Error("Not implemented");
    }

}

export default DBProvider;