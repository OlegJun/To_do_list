import {tasksListValue} from "../mainVariables.js";
import {basicActions} from "../BasicActions/BasicActions.js";

export const actionsWithLocalStorage = {
    setTaskToLocalStorage: function (title, description, date) {
        tasksListValue.push({
            title,
            description,
            date,
        })
        this.sendArrayToLocalStorage()
    },
    getElementToLocalStorageAndRendering: function () {
        if(localStorage.length === 0) {
            localStorage.setItem('tasks', JSON.stringify([]))
            return;
        }
        const tasks = JSON.parse(localStorage.getItem('tasks'))
        if (tasks && tasks.length === 0) {
            return;
        }
        tasks.forEach(el => {
            tasksListValue.push(el)
            const {title, description, date} = el;
            if(!date) {
                basicActions.renderingTask(title, description);
                return;
            }
            const dateString = date.join('.')

            basicActions.renderingTask(title, description, dateString)
        })
    },
    editTaskFieldsAndSubmitToLocalStorage: function (index, valueTitle, valueDescription) {
        const taskFromChange = tasksListValue[index];
        taskFromChange.title = valueTitle;
        taskFromChange.description = valueDescription;
        this.sendArrayToLocalStorage()
    },
    sendArrayToLocalStorage: function () {
        const JsonTasks = JSON.stringify(tasksListValue)
        localStorage.setItem('tasks', JsonTasks)
    }
}