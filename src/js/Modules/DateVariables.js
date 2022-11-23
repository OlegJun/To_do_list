class DateVariables {
    #date = new Date();
    #currentDay = this.#date.getDate();
    #currentMonth = this.#date.getMonth();
    #currentYear = this.#date.getFullYear();

    #dayFromChange = this.#currentDay;
    #monthFromChange = this.#currentMonth;
    #yearFromChange = this.#currentYear;

    #dateString = `${String(this.#currentDay).padStart(2, '0')}.${String(this.#currentMonth).padStart(2, '0')}.${this.#currentYear}`

    get currentDay() {
        return this.#currentDay;
    }

    get currentMonth() {
        return this.#currentMonth;
    }

    get currentYear() {
        return this.#currentYear;
    }

    get day() {
        return this.#dayFromChange
    }
    get month() {
        return this.#monthFromChange
    }
    get year() {
        return this.#yearFromChange
    }

    get dateString() {
        return this.#dateString;
    }

    get currentDateArray() {
        return [this.#currentDay, this.#currentMonth, this.#currentYear]
    }

    get changeableDateArray() {
        return [this.#dayFromChange, this.#monthFromChange, this.#yearFromChange]
    }

    get currentDateToNewDate() {
        return `${this.#currentYear}-${this.#currentMonth + 1}-${this.#currentDay}`
    }

    get changeableDateToNewDate() {
        return `${this.#yearFromChange}-${this.#monthFromChange  + 1}-${this.#dayFromChange}`
    }

    set day(value) {
        this.#dayFromChange = value;
        this.#createDateString()
    }
    set month(value) {
        this.#monthFromChange = value;
        this.#createDateString()
    }
    set year(value) {
        this.#yearFromChange = value;
        this.#createDateString()
    }

    #createDateString(day = this.#dayFromChange, month = this.#monthFromChange, year = this.#yearFromChange) {
        this.#dateString = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`
    }
}

export const GlobalDate = new DateVariables();

export const DateCheck ={
    checkingForPassedOrCurrentDate: function checkingForPassedOrCurrentDate() {
        const dateTask = new Date(GlobalDate.changeableDateToNewDate);
        const dateNow = new Date(GlobalDate.currentDateToNewDate);
        const dateDeference = dateNow - dateTask;

        const numberOfSecondsPerDayToCheck = 86400000;

        if (dateDeference >= numberOfSecondsPerDayToCheck) {
            return ['This task should be deleted because it was not completed on time', true]
        }

        return this.checkingForCurrentDate()
    },
    checkingForCurrentDate: function checkingForCurrentDate() {
        const variableDate = GlobalDate.changeableDateArray;
        const currentDate = GlobalDate.currentDateArray;
        const check = variableDate.every((element, index) => {
            return element === currentDate[index]
        })

        if(check) {
            return ['Attention, the deadline for the task expires today!', false]
        }
        return ['', false]
    }
}