import Task from "/resources/js/task/Task.js";

const TASK_VIEW_TEMPLATE_STRING = document.querySelector("#task-template").innerHTML.trim();

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

    isBoundTo(task) {
        return this.el.getAttribute("data-id") === task.id;
    }

    isBoundToCompletedTask() {
        return this.task.status === Task.CLOSED;
    }

    focus() {
        this.el.querySelector(".task-text-input").focus();
        this.el.querySelector(".task-text-input").select();
    }

    render() {
        this.el.setAttribute("data-id", this.task.id);
        this.el.querySelector(".task-text-input").value = this.task.description;
        if (this.task.status === Task.OPEN) {
            this.el.classList.remove("closed");
            this.el.querySelector(".task-status-checkbox").checked = false;
            this.el.querySelector(".task-text-input").disabled = false;;
        } else {
            this.el.classList.add("closed");
            this.el.querySelector(".task-status-checkbox").checked = true;
            this.el.querySelector(".task-text-input").disabled = true
        }
    }

    onCheckboxStatusChanged() {
        if (this.task) {
            this.task.toggleStatus();
        }
    }

    onKeyPressed(event) {
        if (event.code === "Enter") {
            this.el.querySelector(".task-text-input").blur();
            if (this.task) {
                this.task.updateDescription(event.target.value);
            }
        }
    }

    onTextFocusChanged(event) {
        this.el.classList.toggle("edit");
        if (this.task) {
            this.task.updateDescription(event.target.value);
        }
    }

}

export default TaskView;