import { Event, Observable } from "../utils/Observable.js";

const TASK_VIEW_TEMPLATE_STRING = document.querySelector("#task-template").innerHTML
    .trim();

function broadCastUpdateEvent(context) {
    let event = new Event("taskViewStatusChange", context.task);
    context.notifyAll(event);
}

class TaskView extends Observable {

    constructor(task) {
        super();
        this.task = task;
        this.el = TaskView.createTaskElement();
        this.el.setAttribute("data-id", this.task.id);
        this.statusCheckbox = this.el.querySelector(".task-status-checkbox");
        this.statusCheckbox.checked = this.task.completed;
        this.statusCheckbox.addEventListener("change", this.onCheckboxStatusChanged
            .bind(this));
        this.textInput = this.el.querySelector(".task-text-input");
        this.textInput.value = this.task.description;
        this.textInput.addEventListener("input", this.onTextContentChanged.bind(
            this));
        this.textInput.addEventListener("keypress", this.onKeyPressed.bind(this));
        this.textInput.addEventListener("focus", this.onTextFocusChanged.bind(
            this));
        this.textInput.addEventListener("blur", this.onTextFocusChanged.bind(this));
    }

    getElement() {
        return this.el;
    }

    removeElement() {
        this.el.parentElement.removeChild(this.el);
    }

    getTask() {
        return this.task;
    }

    isMarkedAsCompleted() {
        return this.el.classList.contains("finished");
    }

    onCheckboxStatusChanged() {
        this.task.toggleStatus();
        this.el.classList.toggle("finished");
        this.textInput.disabled = !this.textInput.disabled;
        broadCastUpdateEvent(this);
    }

    onTextContentChanged(event) {
        this.task.setDescription(event.target.value);
        broadCastUpdateEvent(this);
    }

    onKeyPressed(event) {
        if (event.key === "Enter") {
            this.textInput.blur();
        }
    }

    onTextFocusChanged() {
        this.el.classList.toggle("edit");
    }

    focus() {
        this.textInput.focus();
        this.textInput.select();
    }

    static createTaskElement() {
        let el = document.createElement("div");
        el.innerHTML = TASK_VIEW_TEMPLATE_STRING;
        return el.firstChild;
    }

}

export default TaskView;