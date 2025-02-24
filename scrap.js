const inputField = document.querySelector('.input-field')
const submitBtn = document.querySelector('.submit-btn')
const listContainer = document.querySelector('.list-container')

let listArray = []

renderList(listArray)

document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        listArray.push({
            id: crypto.randomUUID(),
            item: inputField.value,
            isChecked: false
        })
        renderList(listArray)
        console.log(listArray)
    }

    else if (e.target.type === 'checkbox') {
        checkItem(e)
    }

    else if (e.target.classList.contains('delete-btn')) {
        const itemIdToDelete = e.target.parentElement.dataset.id
        listArray = listArray.filter((task) => task.id !== itemIdToDelete)
        renderList(listArray)
    }

})

function checkItem(e) {
    e.target.parentElement.classList.toggle('checked')
}

function renderList(listArray) {
    let list = ""
    
    listArray.forEach((task) => {
        list += `
            <div class="list-item">
                <input type="checkbox" data-id=${task.uuid}>
                <p>${task.item}</p>
                <p class="delete-btn">X</p>
            </div>
        `
    })
    inputField.value = ""
    listContainer.innerHTML = list
}