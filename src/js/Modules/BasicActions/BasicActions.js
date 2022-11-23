import {
    changeAndKeepClassName,
    changeStateOfCalendar,
    checkKeyAndCloseTarget,
    closePopup,
    openPopup, removeTaskItemWithAnimation
} from "../mainModule.js";
import {actionsWithLocalStorage} from "../ActionsWithLocalStorage/actionsWithLocalStorage.js";
import {createHTMLElementForTask} from "../../TaskItemHtml/TaskItemHtml.js";
import {ActionsWithTask} from "../ActionsWithTask/ActionsWithTask.js";
import {tasksListValue} from "../mainVariables.js";
import {DateCheck, GlobalDate} from "../DateVariables.js";
import {calendarMenger} from "../CalendarManagement/CalendarManagement.js";

class BasicActions {
    #taskList = document.querySelector('.tasks__list');
    #childrenInTaskList = this.#taskList.children;

    #popupCreateTask = document.querySelector('.popup__window-create');
    #popupWindowDeleteAllTasks = document.querySelector('.popup__window-remove');

    errorMessageEmptyFieldForCreate = document.querySelector('.message__error-create');
    inputTitleTask = document.querySelector('.create__todo-title');
    inputDescriptionTask = document.querySelector('.create__todo-description');
    inputFromOutputDate = document.querySelector('.create__todo-date');

    #checkboxCreateTask = document.querySelector('.checkbox-createTask')
    #buttonForCreateTask = document.querySelector('.create__todo-button');
    #mainButtonCreateTask = document.querySelector('.create__task');
    #buttonToDeleteAllTask = document.querySelector('.deleteAll__todo-button');

    #buttonToConfirmDeletion = document.querySelector('.button__confirmation-yes');

    #buttonToRebutDeletion = document.querySelector('.button__confirmation-no');


    addingADateBool = true;

    get waitEventCreateTask() {
        return this.#waitClickToCreateTask()
    }

    #waitClickToCreateTask () {
        this.#mainButtonCreateTask.addEventListener('click', this.#openPopupCreateTask)
    }

    #openPopupCreateTask = (e) => {
        e.preventDefault()

        calendarMenger.calendarRendering
        openPopup(this.#popupCreateTask)
        checkKeyAndCloseTarget(this.#popupCreateTask)

        this.#checkboxCreateTask.addEventListener('click', this.#addingADate);
        this.#buttonForCreateTask.addEventListener('click', this.#createTask);
    }

    #addingADate = async () => {
        this.addingADateBool = !this.addingADateBool;

        if(!this.addingADateBool) {
            this.inputFromOutputDate.value = '--.--.----'
            await changeStateOfCalendar.calendarHide()
        } else {
            await changeStateOfCalendar.calendarShow()
        }
    }

    #createTask = async (e) => {
        e.preventDefault();

        const titleValue = (this.inputTitleTask.value).trim()
        const descriptionValue = (this.inputDescriptionTask.value).trim();
        const globalDate = GlobalDate;

        if(titleValue) {
            const dateFromChange = globalDate.changeableDateArray;
            const dateString = globalDate.dateString;
            this.#closePopupCreate()
            if(this.addingADateBool) {
                actionsWithLocalStorage.setTaskToLocalStorage(titleValue, descriptionValue, dateFromChange);
                this.renderingTask(titleValue, descriptionValue, dateString);
            } else {
                actionsWithLocalStorage.setTaskToLocalStorage(titleValue, descriptionValue, '');
                this.renderingTask(titleValue, descriptionValue, '');
            }

            this.inputTitleTask.value = '';
            this.inputDescriptionTask.value = '';

            return;
        }

        if (!titleValue && !this.errorMessageEmptyFieldForCreate.classList.contains('active')) {
            await changeAndKeepClassName(this.errorMessageEmptyFieldForCreate, 'active')
        }
    }

    renderingTask (valueTitle, valueDescription, date = '') {
        let warningMessage = '';
        let dateDelay = false;
        if(date) {
            [warningMessage, dateDelay] = DateCheck.checkingForPassedOrCurrentDate();
        }
        this.#taskList.insertAdjacentHTML('beforeend', createHTMLElementForTask(valueTitle, valueDescription, date, warningMessage))

        const taskItem = this.#childrenInTaskList[this.#childrenInTaskList.length - 1]

        setTimeout(() => {
            taskItem.classList.add('show')
            if(dateDelay) {
                taskItem.classList.add('overdue')
            }
        }, 10);

        const actionsTaskItem = new ActionsWithTask(taskItem, tasksListValue);
        actionsTaskItem.change
        actionsTaskItem.delete
    }

    #closePopupCreate () {
        closePopup(this.#popupCreateTask);
        this.#checkboxCreateTask.removeEventListener('click', this.#addingADate);
        this.#buttonForCreateTask.removeEventListener('click', this.#createTask);
        calendarMenger.closeCalendar
    }

    get eventListenerDeleteAll() {
        return this.#waitToClickDeleteAll()
    }

    #waitToClickDeleteAll() {
        this.#buttonToDeleteAllTask.addEventListener('click', this.#openPopupDeleteAllTask)
    }

    #openPopupDeleteAllTask = (e) => {
        openPopup(this.#popupWindowDeleteAllTasks)

        this.#buttonToConfirmDeletion.addEventListener('click', this.#deleteAllTask)
        this.#buttonToRebutDeletion.addEventListener('click', this.#closePopupDeleteAll)
    }

    #deleteAllTask = () => {
        const iteration = tasksListValue.length
        for(let i = 0; i < iteration; i++) {
            removeTaskItemWithAnimation(this.#childrenInTaskList[i])
        }
        localStorage.clear();
        this.#closePopupDeleteAll()
    }

    #closePopupDeleteAll = () => {
        closePopup(this.#popupWindowDeleteAllTasks)

        this.#buttonToConfirmDeletion.removeEventListener('click', this.#deleteAllTask)
        this.#buttonToRebutDeletion.removeEventListener('click', this.#deleteAllTask)
    }

}

export const basicActions = new BasicActions();