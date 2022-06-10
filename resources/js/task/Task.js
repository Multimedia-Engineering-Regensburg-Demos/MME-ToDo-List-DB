import { Observable, Event } from "/resources/js/utils/Observable.js";

const DEFAULT_TEXT = "New task";

class Task extends Observable {

    constructor(description = DEFAULT_TEXT, id = Date.now().toString(), status = Task.OPEN) {
        super();
        this.description = description;
        this.id = id;
        this.status = status;
    }

    updateDescription(description) {
        this.description = description;
        this.notifyAll(new Event("update", this));
    }

    toggleStatus() {
        if (this.status === Task.OPEN) {
            this.status = Task.CLOSED;
        } else {
            this.status = Task.OPEN;
        }
        this.notifyAll(new Event("update", this));
    }

    static OPEN = "Task.Open";
    static CLOSED = "Task.Closed";

    static fromObject(obj) {
        return new Task(obj.description, obj.id, obj.status);
    }

}

export default Task;