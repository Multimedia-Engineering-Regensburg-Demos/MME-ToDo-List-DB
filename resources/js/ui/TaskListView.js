import { Event, Observable } from "/resources/js/utils/Observable.js";
import TaskView from "/resources/js/ui/TaskView.js";

const taskViews = [];

class TaskListView extends Observable {

    constructor(el) {
        super();
        this.el = el;
        this.el.querySelector(".new-task").addEventListener("click", () => this.onNewTaskButtonClicked());
        this.el.querySelector(".clear-list").addEventListener("click", () => this.onClearTasksButtonClicked());
    }

    add(task) {
        let taskView = new TaskView();
        taskView.bind(task);
        taskView.appendTo(this.el.querySelector(".task-list"));
        taskViews.push(taskView);
    }

    update(task) {
        let taskView = taskViews.find((view) => view.isBoundTo(task));
        taskView.render();
    }

    remove(task) {
        let taskViewIndex = taskViews.findIndex((view) => view.isBoundTo(task));
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
        let completedTasks = taskViews.filter((view) => view.isBoundToCompletedTask()).map((view) => view.task);
        this.notifyAll(new Event("taskCleanupRequested", completedTasks));
    }

}

export default TaskListView;