import {checkClassAndRemove} from "../mainModule.js";
import {GlobalDate} from "../DateVariables.js";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const allTableCells = createAnArrayWithAllTableCells();

const chooseMonth = document.querySelector('.calendar__select-mouth');
const chooseYear = document.querySelector('.calendar__select-year');
const allMonthFromChange = chooseMonth.children;
const allYearFromChange = chooseYear.children;


export function fillInTheSelectionFields(allYearFromChange) {
    const optionSelectYear = [...allYearFromChange]

    optionSelectYear.forEach((el, index) => {
        el.value = GlobalDate.currentYear + index
        el.textContent = GlobalDate.currentYear + index
    })
}

export function calculateNumberOfDays (month = GlobalDate.month, year = GlobalDate.year) {
    return (33 - new Date(year, month, 33).getDate());
}
/*--------------------------------------------------------------------------------------*/

//Функция для расчета дня недели, по числу месяцу и году
export function determineStartDayOfTheMonth (date, month, year) {
    if ((date < 0 || date > 31) || (month < 0 || month > 11) || (year < 2000 || year > 2100)) {
        alert('Я думаю, что такие даты вам не нужны...')
        return;
    }

    const monthCodeList = [
        [3, 6],
        [0, 9],
        [4],
        [7],
        [1, 2, 10],
        [5],
        [11, 8],
    ];

    const dayWeek = [
        'sat',
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
    ];

    let monthCode;

    monthCodeList.forEach((el, index) => {
        const boolFindElement = el.find(i => i === month) !== undefined;
        if (boolFindElement) {
            monthCode = index;
        }
    })

    const lastFigures = Number(String(year).slice(2));
    const yearCode = (6 + lastFigures + Math.floor(lastFigures / 4)) % 7;
    const dayWeekNumber = (date + monthCode + yearCode) % 7;

    if (year % 4 === 0) {
        let indexToGet;
        dayWeekNumber === 0
            ? indexToGet = 6
            : indexToGet = dayWeekNumber - 1
        return dayWeek[indexToGet]
    } else {
        return dayWeek[dayWeekNumber]
    }
}
/*--------------------------------------------------------------------------------------*/

//Функция для заполнения переданного в нее массива ячейками из всей таблицы
export function createAnArrayWithAllTableCells() {
    const arrayToFill = [];
    const tableDay = (document.querySelector('.calendar__body')).children;
    for (let i = 0; i < tableDay.length; i++) {
        arrayToFill.push(...tableDay[i].children);
    }
    return arrayToFill;
}
/*--------------------------------------------------------------------------------------*/

//Функция для проверки классов и очищении полей при заполнении или изменении календаря
export function validatingClassesAndClearingFields(arrayFromIteration) {
    arrayFromIteration.forEach((el, index) => {
        checkClassAndRemove(el, 'now')
        checkClassAndRemove(el, 'disable')
        checkClassAndRemove(el, 'selected')
        checkClassAndRemove(el, 'none')
        el.textContent = '';
    });
}
/*--------------------------------------------------------------------------------------*/

//Функция для нахождения индекса с которого будет начинаться заполнение календаря
function findTheStartOfTheCalendar(month = GlobalDate.month, year = GlobalDate.year) {
    const currentNumberDaysMonth = calculateNumberOfDays(month, year);
    const dayWeek = determineStartDayOfTheMonth(1, month, year);

    for (let j = 0; j < currentNumberDaysMonth; j++) {
        const classDayWeek = allTableCells[j].className.split(' ')[0]
        if (classDayWeek === dayWeek) {
            return j;
        }
    }
}
/*--------------------------------------------------------------------------------------*/

/*Функция для заполнения таблицы, удаления ячеек без чисел и выбора текущей даты.
Аргументами принимает месяц и год, который выбрал пользователь и переменную выбранного элемента в таблице.
Так же отдает элемент, содержащий текущую дату.*/
export function fillCalendar (month = GlobalDate.month, year = GlobalDate.year) {
    const currentNumberDaysMonth = calculateNumberOfDays(month, year);
    let indexForStart = findTheStartOfTheCalendar(month, year);
    let selectElement;

    for (let l = 0; l < allTableCells.length; l++) {
        const elementIteration = allTableCells[l];
        const daysNumber = l + 1;
        const calendarFillElement = allTableCells[indexForStart];
        if (l < currentNumberDaysMonth) {
            calendarFillElement.textContent = daysNumber;
        }
        if (elementIteration.innerText === '') {
            elementIteration.classList.add('none')
        }
        if(elementIteration && elementIteration.classList.contains('selected')) {
            elementIteration.classList.remove('selected')
        }
        if (year === GlobalDate.currentYear
            && month === GlobalDate.currentMonth
            && daysNumber < GlobalDate.currentDay) {
            calendarFillElement.classList.add('disable')
        }
        indexForStart++;
    }
    return selectElement
}
/*--------------------------------------------------------------------------------------*/

/*Функция для изменения выбранного месяца и года, в selects (чтобы не возникало путаницы при переключении месяца по кнопке)
аккамулирующие переменные, чтобы не вызывать циклы если пользователь "проходит" по текущему году или месяцу*/
export function changeSelectedMonthAndYear(month, year) {
    for (let y = 0; y < allMonthFromChange.length; y++) {
        const monthIteration = allMonthFromChange[y];
        if (Number(monthIteration.value) === month) {
            monthIteration.selected = true;
        } else {
            monthIteration.selected = false;
        }
    }
    for (let l = 0; l < allYearFromChange.length; l++) {
        const yearIteration = allYearFromChange[l];
        if (Number(yearIteration.value) === year) {
            yearIteration.selected = true;
        } else {
            yearIteration.selected = false;
        }
    }
}
/*--------------------------------------------------------------------------------------*/

/*Функция для блокировки дней и месяцов до текущего, так как задача должна быть на будущее*/
export function disableSelectionPreviousMonth() {
    if (GlobalDate.year === GlobalDate.currentYear) {
        for (let t = 0; t < allMonthFromChange.length; t++) {
            const monthElement = allMonthFromChange[t];
            const monthValueNumber = Number(monthElement.value);
            if (monthValueNumber < GlobalDate.currentMonth) {
                monthElement.disabled = true
            }
            if (monthValueNumber === GlobalDate.currentMonth) {
                monthElement.selected = true
            }
        }
    }
}
/*--------------------------------------------------------------------------------------*/

/*
Функция для заполнения календаря с учетом дня недели, с которого начинается месяц
сначала создаем массив из всех ячеек в таблице
(переменная для проверки, первый ли раз вызывается фнукция)
*/
export function fillOutTheCalendar(month, year) {
    const titleCalendar = document.querySelector('.calendar__month-year');
    titleCalendar.textContent = `${months[month]} ${year}`;
    validatingClassesAndClearingFields(allTableCells);
    return fillCalendar(month, year);
}
/*--------------------------------------------------------------------------------------*/

/*Функция для разрешения пользователю выбирать месяцы
при смене года transferYear присваиваться false, чтобы не вызавать функцию несколько раз в одном году*/
export function removeDisabled() {
    if (GlobalDate.year > GlobalDate.currentYear) {
        for (let t = 0; t < allMonthFromChange.length; t++) {
            allMonthFromChange[t].disabled = false;
        }
    }
}
/*--------------------------------------------------------------------------------------*/