import {
    changeSelectedMonthAndYear,
    disableSelectionPreviousMonth,
    fillCalendar,
    fillInTheSelectionFields, fillOutTheCalendar, removeDisabled
} from "./calendarModule.js";
import {GlobalDate} from "../DateVariables.js";
import {defineParentElement, fillCurrentDate} from "../mainModule.js";

class CalendarManagement {
    #tableCalendar = document.querySelector('.calendar__body');

    #chooseMonth = document.querySelector('.calendar__select-mouth');
    #chooseYear = document.querySelector('.calendar__select-year');

    #allYearFromChange = this.#chooseYear.children;

    #buttonNextMonth = document.querySelector('.calendar__next');
    #buttonPreviousMonth = document.querySelector('.calendar__previous');

    #selectDate;

    get calendarRendering() {
        return this.#calendarEventsListeners()
    }

    get closeCalendar() {
        return this.#closeCalendar()
    }

    #calendarEventsListeners() {
        this.#selectDate = fillCalendar()
        fillInTheSelectionFields(this.#allYearFromChange)

        this.#buttonNextMonth.addEventListener('click', this.#switchToNextMonth);
        this.#buttonPreviousMonth.addEventListener('click', this.#switchToPreviousMonth);

        this.#chooseMonth.addEventListener('change', this.#changeMonthWhenSelected);
        this.#chooseYear.addEventListener('change', this.#changeYearWhenSelected);

        this.#tableCalendar.addEventListener('click', this.#selectDateByClick)
    }

    #switchToNextMonth = (e) => {
        e.preventDefault()

        if (GlobalDate.year === GlobalDate.currentYear + 9
            && GlobalDate.month === 11) {
            alert('Я думаю этого будет достаточно...')
            return;
        }
        if (GlobalDate.month === 11) {
            GlobalDate.year += 1;
            GlobalDate.month = 0;
            removeDisabled();
        } else {
            GlobalDate.month++
        }

        this.#selectDate = this.#changeTheSelectedItemAndFillInTheInput(GlobalDate.month, GlobalDate.year)

        changeSelectedMonthAndYear(GlobalDate.month, GlobalDate.year)
    }

    #switchToPreviousMonth = (e) => {
        e.preventDefault()

        if (GlobalDate.month === 0 && GlobalDate.year > GlobalDate.currentYear) {
            GlobalDate.year -= 1;
            GlobalDate.month = 11;
            disableSelectionPreviousMonth();
        } else if (GlobalDate.month === GlobalDate.currentMonth && GlobalDate.year === GlobalDate.currentYear) {
            alert('Как вы собираетесь выполнять задания в прошлом?')
            return;
        } else {
            GlobalDate.month -= 1;
        }
        changeSelectedMonthAndYear(GlobalDate.month, GlobalDate.year)
        this.#selectDate = this.#changeTheSelectedItemAndFillInTheInput(GlobalDate.month, GlobalDate.year)
    }

    #changeMonthWhenSelected = (e) => {
        GlobalDate.month = Number(e.target.value);
        this.#selectDate = this.#changeTheSelectedItemAndFillInTheInput(GlobalDate.month, GlobalDate.year)
    }

    #changeYearWhenSelected = (e) => {
        GlobalDate.year = Number(e.target.value);
        removeDisabled();
        disableSelectionPreviousMonth();
        this.#selectDate = this.#changeTheSelectedItemAndFillInTheInput(GlobalDate.month, GlobalDate.year)
    }

    #selectDateByClick = (e) => {
        if (!(Number(e.target.innerText)) || e.target.classList.contains('disable')) {
            return;
        }
        if(this.#selectDate && this.#selectDate.classList.contains('selected')) {
            this.#selectDate.classList.remove('selected');
        }
        this.#selectDate = e.target;
        this.#selectDate = defineParentElement(this.#selectDate.className, this.#selectDate)
        this.#selectDate.classList.add('selected');
        const elementTargetValue = this.#selectDate.innerText
        GlobalDate.day = Number(elementTargetValue)

        fillCurrentDate(elementTargetValue, GlobalDate.month, GlobalDate.year)
    }

    #closeCalendar() {
        this.#buttonNextMonth.removeEventListener('click', this.#switchToNextMonth);
        this.#buttonPreviousMonth.removeEventListener('click', this.#switchToPreviousMonth);
        this.#chooseMonth.removeEventListener('change', this.#changeMonthWhenSelected);
        this.#chooseYear.removeEventListener('change', this.#changeYearWhenSelected);
        this.#tableCalendar.removeEventListener('click', this.#selectDateByClick)
    }

    #changeTheSelectedItemAndFillInTheInput(month, year) {
        fillCurrentDate(undefined, month, year)
        return fillOutTheCalendar(month, year);
    }
}

export const calendarMenger = new CalendarManagement();