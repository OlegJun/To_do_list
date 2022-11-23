import {GlobalDate} from "./DateVariables.js";

/*Сон*/
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/*--------------------------------------------------------------------------------------*/

/*Функция для добавление к элементу класса, на определенное время*/
export async function changeAndKeepClassName (element, className, second = 3000) {
    element.classList.add(className)
    await sleep(second)
    element.classList.remove(className)
}
/*--------------------------------------------------------------------------------------*/

//Функция для проверки класса в элементе, и его удаления
export function checkClassAndRemove (element, classList) {
    if (element.classList.contains(`${classList}`)) {
        element.classList.remove(`${classList}`)
    }
}
/*--------------------------------------------------------------------------------------*/

//Функция для "всплытия" до ближайщего родителя с классом, как только найдет родителя возращает его
export function defineParentElement (className, elementTarget, accurateCheck = false) {
    if(accurateCheck) {
        try {
            let classNameElem;
            while (classNameElem !== className) {
                console.log(className,classNameElem)
                elementTarget = elementTarget.parentElement
                classNameElem = elementTarget.className
            }
        } catch (e) {
            console.error(e, 'The specified class was not found')
        }
        return elementTarget;
    }
    else{
        while (!className) {
            elementTarget = elementTarget.parentElement
            className = elementTarget.className
        }
        return elementTarget;
    }
}
/*--------------------------------------------------------------------------------------*/

/*Функция для проверки нажатой кнопки или кнопки и закрытия popup*/
export function checkKeyAndCloseTarget (target) {
    const targetClose = target.querySelector('.close__popupCreate');

    if(!target) {
        console.error('Specify the target to close');
        return;
    }

    const checkKeyPressedAndClosePopup = handleKeypress.bind(null, target)
    document.addEventListener('keydown', checkKeyPressedAndClosePopup)

    function handleKeypress(target, e) {
        const targetKeyDown = e.target.id;
        const pressedKey = e.code
        if (!targetKeyDown && (pressedKey === 'Escape' || pressedKey === 'Backspace')) {
            closePopup(target)
        }
    }

    if(!targetClose) {
        return;
    }

    targetClose.addEventListener('click', () => {
        closePopup(target)
    });
}
/*--------------------------------------------------------------------------------------*/

//Функция закрытия попапа
export function closePopup(target) {
    target.classList.remove('active')
    setTimeout(() => {
        target.style.display = 'none'
    }, 200)
}
/*--------------------------------------------------------------------------------------*/

//Функция открытия попапа
export function openPopup(target) {
    target.style.display = 'flex'
    setTimeout(() => {
        target.classList.add('active');
    },0)
}
/*--------------------------------------------------------------------------------------*/

//По-умолчанию, input заполняется текущей дата.месяц.год
export function fillCurrentDate (day = GlobalDate.currentDay, month = GlobalDate.currentMonth, year = GlobalDate.currentYear) {
    const inputFromOutputDate = document.querySelector('.create__todo-date');
    inputFromOutputDate.value = (`${createPadStartDate(day)}.${createPadStartDate(month, true)}.${year}`);
};

fillCurrentDate()
/*--------------------------------------------------------------------------------------*/


//Функция для создания дат (постановка 0 перед цифрой)
function createPadStartDate (value, month = false) {
    if(month) {
        return String(value + 1).padStart(2, '0');
    }
    return String(value).padStart(2, '0');
}
/*--------------------------------------------------------------------------------------*/

/*Функция удаления задачи из списка*/
export function removeTaskItemWithAnimation(taskFromRemove) {
    const taskList = document.querySelector('.tasks__list');
    setTimeout(() => {
        taskList.removeChild(taskFromRemove);
    }, 500)
    taskFromRemove.classList.remove('show');
}
/*--------------------------------------------------------------------------------------*/

/*Обьект для плавного закрытия или открытия popup-а*/
function HideOrShowCalendar (calendar) {
    this.calendarShow = async function() {
        fillCurrentDate()
        calendar.classList.remove('none');
        await sleep(10)
        calendar.classList.remove('disable');
    }

    this.calendarHide = async function() {
        calendar.classList.add('disable');
        await sleep(500);
        calendar.classList.add('none')
    }
}

export const changeStateOfCalendar = new HideOrShowCalendar(document.querySelector('.popup__calendar'))
/*--------------------------------------------------------------------------------------*/