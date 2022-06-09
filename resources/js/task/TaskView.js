import Task from "./Task.js";

const TASK_VIEW_TEMPLATE_STRING = document.querySelector("#task-template").innerHTML
    .trim();

function createTaskElementForView(view) {
    let el = document.createElement("div");
    el.innerHTML = TASK_VIEW_TEMPLATE_STRING;
    el.querySelector(".task-status-checkbox").addEventListener("change", view.onCheckboxStatusChanged.bind(view));
    el.querySelector(".task-text-input").addEventListener("keypress", view.onKeyPressed.bind(view));
    el.querySelector(".task-text-input").addEventListener("focus", view.onTextFocusChanged.bind(view));
    el.querySelector(".task-text-input").addEventListener("blur", view.onTextFocusChanged.bind(view));
    return el.firstChild;
}

class TaskView {

    constructor() {
        this.el = createTaskElementForView(this);
    }

    appendTo(parent) {
        parent.append(this.el);
    }

    remove() {
        this.task = undefined;
        this.el.remove();
    }

    bind(task) {
        this.task = task;
        this.task.addEventListener("update", (event) => this.render(event.data));
        this.render(this.task);
    }

    holds(task) {
        return this.el.getAttribute("data-id") === task.id;
    }

    focus() {
        this.el.querySelector(".task-text-input").focus();
        this.el.querySelector(".task-text-input").select();
    }

    render() {
        this.el.setAttribute("data-id", this.task.id);
        this.el.querySelector(".task-text-input").value = this.task.description;
        // TODO Think about switching condition to check for OPEN tasks first
        if (this.task.status === Task.CLOSED) {
            this.el.classList.add("closed");
            this.el.querySelector(".task-status-checkbox").checked = true;
            this.el.querySelector(".task-text-input").disabled = true;
        } else {
            this.el.classList.remove("closed");
            this.el.querySelector(".task-status-checkbox").checked = false;
            this.el.querySelector(".task-text-input").disabled = false;
        }
    }

    onCheckboxStatusChanged() {
        if (this.task) {
            this.task.toggleStatus();
        }
    }

    onKeyPressed(event) {
        if (event.key === "Enter") {
            this.el.querySelector(".task-text-input").blur();
            if (this.task) {
                this.task.updateDescription(event.target.value);
            }
        }
    }

    onTextFocusChanged() {
        this.el.classList.toggle("edit");
    }

}

export default TaskView;