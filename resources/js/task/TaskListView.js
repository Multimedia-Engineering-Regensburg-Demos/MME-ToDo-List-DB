import TaskView from "./TaskView.js";
import { Event, Observable } from "../utils/Observable.js";

const taskViews = [];

class TaskListView extends Observable {

    constructor(el) {
        super();
        this.el = el;
        this.el.querySelector(".button.new-task").addEventListener("click", () => this.onNewTaskButtonClicked());
        this.el.querySelector(".button.clear-list").addEventListener("click", () => this.onClearListButtonClicked());
    }

    add(task) {
        let taskView = new TaskView();
        taskView.bind(task);
        taskView.appendTo(this.el.querySelector(".task-list"));
        taskViews.push(taskView);
    }

    update(task) {
        let taskView = taskViews.find((view) => view.holds(task));
        taskView.render();
    }

    remove(task) {
        let taskViewIndex = taskViews.findIndex((view) => view.holds(task));
        if (TaskListView === -1) {
            return;
        }
        taskViews[taskViewIndex].remove();
        taskViews.splice(taskViewIndex, 1);
    }

    onNewTaskButtonClicked() {
        this.notifyAll(new Event("newTaskRequested"));
    }

    onClearTasksButtonClicked() {
        this.notifyAll(new Event("taskCleanupRequested"));
    }

}

export default TaskListView;