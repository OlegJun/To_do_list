import {tasksListValue} from "../mainVariables.js";

import {
    changeAndKeepClassName,
    closePopup,
    openPopup, removeTaskItemWithAnimation,
} from "../mainModule.js";

import {actionsWithLocalStorage} from "../ActionsWithLocalStorage/actionsWithLocalStorage.js";

export class ActionsWithTask {
    #taskList = document.querySelector('.tasks__list');
    #popupToChangeTheTask = document.querySelector('.popup__window-change');
    #errorMessageEmptyFieldForChange = this.#popupToChangeTheTask.querySelector('.message__error-change');
    inputTitleChange = this.#popupToChangeTheTask.querySelector('.change__todo-title');
    inputDescriptionChange = this.#popupToChangeTheTask.querySelector('.change__todo-description');
    #buttonConfirmationChange = this.#popupToChangeTheTask.querySelector('.button__confirmation-change');
    #buttonRebutChange = this.#popupToChangeTheTask.querySelector('.button__rebut-change');

    titleTask;
    descriptionTask;
    #objectForSearch;
    #buttonToChangeTheTask;
    #buttonToDeleteTheTask;

    constructor(task) {
        this.task = task;
        this.titleTask = this.task.querySelector('.title__text')
        this.descriptionTask = this.task.querySelector('.task__item-description')
        this.#buttonToChangeTheTask = this.task.querySelector('.button__change-task');
        this.#buttonToDeleteTheTask = this.task.querySelector('.button__delete-task');
        this.#objectForSearch = tasksListValue[this.#taskList.children.length - 1]
    }
    get change() {
        return this.#taskChanges();
    }

    #taskChanges() {
        this.#buttonToChangeTheTask.addEventListener('click', this.#openChangePopup);
    }

    #openChangePopup = () => {
        this.inputTitleChange.value = this.titleTask.textContent.trim();
        this.inputDescriptionChange.value = this.descriptionTask.textContent.trim();
        openPopup(this.#popupToChangeTheTask)
        this.#buttonConfirmationChange.addEventListener('click', this.#changeTask);
        this.#buttonRebutChange.addEventListener('click', this.#closePopupToChangeTheTask);
    }

    #changeTask = () => {
        const valueTitle = (this.inputTitleChange.value).trim();
        const valueDescription = (this.inputDescriptionChange.value).trim();
        if (!valueTitle) {
            changeAndKeepClassName(this.#errorMessageEmptyFieldForChange, 'active')
            return;
        }
        const indexTask = tasksListValue.indexOf(this.#objectForSearch);
        actionsWithLocalStorage.editTaskFieldsAndSubmitToLocalStorage(indexTask, valueTitle, valueDescription)

        this.titleTask.textContent = valueTitle;
        this.descriptionTask.textContent = valueDescription;
        this.#closePopupToChangeTheTask()
    }

    #closePopupToChangeTheTask = () => {
        this.#errorMessageEmptyFieldForChange.classList.remove('active')
        closePopup(this.#popupToChangeTheTask)
        this.#buttonConfirmationChange.removeEventListener('click', this.#changeTask);
        this.#buttonRebutChange.removeEventListener('click', this.#closePopupToChangeTheTask);
    }

    get delete() {
        return this.#deleteTask();
    }

    #deleteTask() {
        this.#buttonToDeleteTheTask.addEventListener('click', this.#removeTaskItem)
    }

    #removeTaskItem = (e, taskFromRemove = this.task) => {
        const indexTask = tasksListValue.indexOf(this.#objectForSearch);
        tasksListValue.splice(indexTask, 1);

        removeTaskItemWithAnimation(taskFromRemove);
        actionsWithLocalStorage.sendArrayToLocalStorage();

        this.#buttonToDeleteTheTask.addEventListener('click', this.#removeTaskItem)
        this.#buttonToChangeTheTask.removeEventListener('click', this.#openChangePopup);
    }
}
