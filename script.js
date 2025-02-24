const inputField = document.querySelector('.input-field')
const submitBtn = document.querySelector('.submit-btn')
const listContainer = document.querySelector('.list-container')

const taskArray = ["Chicken", "Eggs", "Popoto", "Aunt Slappy's Flappy Snackies", "Beef"]
renderList(taskArray)


document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        taskArray.push(inputField.value)
        renderList(taskArray)
    }

    else if (e.target.type === 'checkbox') {
        checkItem(e)
    }
})

function checkItem(e) {
    e.target.parentElement.classList.toggle('checked')
}

function renderList(taskArray) {
    let list = ""
    
    taskArray.forEach((task) => {
        list += `
            <div class="list-item">
                <input type="checkbox">
                <p>${task}</p>
                <p class="delete-btn">X</p>
            </div>
        `
    })
    inputField.value = ""
    listContainer.innerHTML = list
}