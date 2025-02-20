const taskInput = document.getElementById('task-input')
const submitBtn = document.getElementById('submit-btn')
const list = document.getElementById('list')

let tasks = []

submitBtn.addEventListener('click', handleSubmit)

function handleSubmit() {
    tasks.push(taskInput.value)
    list.innerHTML = renderList(tasks)
}

function renderList(tasks) {
    let taskList = ''
    tasks.forEach((task) => {
        taskList += `
            <div class="task-item">
                <input type="checkbox" id="checkbox">
                <p>${task}</p>
                <p id="delete">X</p>
            </div>
        `
    })
    return taskList
}