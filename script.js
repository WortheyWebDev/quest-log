const inputField = document.querySelector('.input-field')
const submitBtn = document.querySelector('.submit-btn')
const listContainer = document.querySelector('.list-container')
const questDetailsTextarea = document.querySelector('.quest-details')
const questTitle = document.querySelector('.quest-title')

let itemArray = []
let selectedQuestId = null

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
    else if (e.target.classList.contains('bookmark')) {
        setBookmarked(e)
    }
    else if (e.target.closest('.list-item')) {
        const questId = e.target.closest('.list-item').dataset.id
        selectedQuestId = questId

        const selectedQuest = itemArray.find((item) => item.id === questId)
            if (selectedQuest) {
                questDetailsTextarea.value = selectedQuest.questDetails || ""
                questTitle.textContent = selectedQuest.item
            }
    }
})

questDetailsTextarea.addEventListener('input', function() {
    getQuestDetails()
})

function getQuestDetails() {
    if (selectedQuestId) {
        const selectedQuest = itemArray.find((item) => item.id === selectedQuestId)
        if (selectedQuest) {
            selectedQuest.questDetails = questDetailsTextarea.value
        }
    }
}

function setBookmarked(e) {
    const bookmarkedItem = itemArray.find((item) => item.id === e.target.closest('.list-item').dataset.id)
    bookmarkedItem.isBookmarked = !bookmarkedItem.isBookmarked
    renderList()
}

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
            isChecked: false,
            questDetails: "",
            isBookmarked: false
        })
    }
}

function renderList() {
    let listItems = ""

    if (itemArray.length === 0) {
        questTitle.textContent = "There are no quests..."
        questDetailsTextarea.placeholder = "Add a quest to get started!"
    }
    
    itemArray.forEach((item) => {
        listItems += `
            <div class="list-item ${item.isChecked ? 'checked' : ''}" data-id="${item.id}">
                <input type="checkbox" data-checkbox="${item.id}" ${item.isChecked ? 'checked' : ''}>
                <p>${item.item}</p>
                <div class="icons">
                    <img class="bookmark" src="${item.isBookmarked ? './images/bookmark-fill.svg' : './images/bookmark.svg'}" alt="A bookmark icon.">
                    <p class="delete-btn" data-delete="${item.id}">X</p>
                </div>
            </div>
        `
    })
    inputField.value = ""
    listContainer.innerHTML = listItems
}