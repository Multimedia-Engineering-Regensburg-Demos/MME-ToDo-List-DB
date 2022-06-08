const DEFAULT_TASK_TEXT = "New Task";

class Task {

    constructor(description = DEFAULT_TASK_TEXT, id = Date.now().toString(), completed = false) {
        this.description = description;
        this.id = id;
        this.completed = completed;
    }

    setDescription(description) {
        this.description = description;
    }

    toggleStatus() {
        this.completed = !this.completed;
        return this.completed;
    }

    static fromObject(obj) {
        return new Task(obj.description, obj.id, obj.completed);
    }

}

export default Task;