/*Создание HTML обьекта 'task__item' для списка*/
export function createHTMLElementForTask(valueTitle, valueDescription, date, expirationWarning) {
    return `           
           <div class="task__item">
               <div class="task__body">
                   <div class="task__item-title">
                       <div class="title__text">
                           ${valueTitle}
                       </div>
                       ${date ?
                            `<div class="title__date">
                                Date:${date}
                                <p class="warning">
                                    ${expirationWarning}
                                </p>
                            </div>`
                            : ''}
                   </div>
                    <div class="task__item-description">
                       ${valueDescription}
                    </div>
               </div>
               <div class="task__btn">
                   <button class="button__delete-task button">
                       Delete
                   </button>
                   <button class="button__change-task button">
                       Change
                   </button>
               </div>
           </div>
    `
}
/*--------------------------------------------------------------------------------------*/