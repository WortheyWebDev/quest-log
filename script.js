const inputField = document.querySelector('.input-field')
const submitBtn = document.querySelector('.submit-btn')
const listContainer = document.querySelector('.list-container')

let itemArray = []

document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        getItemInput(e)
        renderList()
    }
    else if (e.target.type === "checkbox") {
        setChecked(e)
    }
    else if (e.target.classList.contains('delete-btn')) {
        removeItem(e)
    }
})

function removeItem(e) {
    const itemId = e.target.dataset.delete
    itemArray = itemArray.filter((item) => item.id !== itemId)
    renderList()
}

function setChecked(e) {
    const checkedItem = itemArray.find((checkedItem) => checkedItem.id === e.target.dataset.checkbox)
    if (checkedItem) {
        checkedItem.isChecked = !checkedItem.isChecked
        renderList()
    }
}

function getItemInput(e) {
    if (inputField.value.trim() !== "") {
        itemArray.push({
            id: crypto.randomUUID(),
            item: inputField.value,
            isChecked: false
        })
    }
}

function renderList() {
    let listItems = ""
    itemArray.forEach((item) => {
        listItems += `
            <div class="list-item ${item.isChecked ? 'checked' : ''}">
                <input type="checkbox" data-checkbox="${item.id}" ${item.isChecked ? 'checked' : ''}>
                <p>${item.item}</p>
                <p class="delete-btn" data-delete="${item.id}">X</p>
            </div>
        `
    })
    inputField.value = ""
    listContainer.innerHTML = listItems
}