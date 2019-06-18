/* eslint-env browser */

import { Event, Observable } from "../utils/Observable.js";

const TASK_VIEW_TEMPLATE_STRING = document.querySelector("#task-template").innerHTML
  .trim();

function createTaskElement() {
  let el = document.createElement("div");
  el.innerHTML = TASK_VIEW_TEMPLATE_STRING;
  return el.firstChild;
}

class TaskView extends Observable {

  constructor(task) {
    super();
    this.task = task;
    this.el = createTaskElement();
    this.el.setAttribute("data-id", this.task.id);
    if (task.completed === true) {
      this.el.classList.add("finished");
    }
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

  setFocus() {
    this.textInput.focus();
    this.textInput.select();
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
    let event = new Event("taskViewStatusChange", this);
    this.task.toggleStatus();
    this.el.classList.toggle("finished");
    this.textInput.disabled = !this.textInput.disabled;
    this.notifyAll(event);
  }

  onTextContentChanged() {
    let event = new Event("taskViewTextChange", this);
    this.task.setDescription(this.textInput.value);
    this.notifyAll(event);
  }

  onKeyPressed(event) {
    if (event.key === "Enter") {
      this.textInput.blur();
    }
  }

  onTextFocusChanged() {
    this.el.classList.toggle("edit");
  }

}

export default TaskView;