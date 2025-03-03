const inputField = document.querySelector('.input-field')
const submitBtn = document.querySelector('.submit-btn')
const listContainer = document.querySelector('.list-container')
const questDetailsTextarea = document.querySelector('.quest-details')
const questTitle = document.querySelector('.quest-title')
const bookmarkedDiv = document.querySelector('.bookmarked-div')
const deadlineClearBtn = document.querySelector('.deadline-clear-btn')

const deadlinePickerInstance = flatpickr("#deadline-picker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true,
    altInputClass: "flatpickr-style",
    altFormat: "F j, Y (h:i K)",
    onChange: function(selectedDates, dateStr, instance) {
        if (selectedQuestId) {
            const selectedQuest = itemArray.find((item) => item.id === selectedQuestId)
            if (selectedQuest) {
                selectedQuest.deadline = dateStr
                localStorage.setItem("quests", JSON.stringify(itemArray))
            }
        }
        if (dateStr) {
            deadlineClearBtn.classList.remove('hide-element')
        } else {
            deadlineClearBtn.classList.add('hide-element')
        }
    }
})

let itemArray = []
let selectedQuestId = null

document.addEventListener('DOMContentLoaded', function() {
    const savedQuests = localStorage.getItem("quests")
    if (savedQuests) {
        itemArray = JSON.parse(savedQuests)
        
        if (itemArray.length > 0) {
            questTitle.textContent = itemArray[0].item
            questDetailsTextarea.value = itemArray[0].questDetails
        } if (itemArray[0].isBookmarked) {
            bookmarkedDiv.style.display = 'block'
        }
        itemArray.forEach((item) => {
            item.isSelected = false
        })
        itemArray[0].isSelected = true
    }
    renderList()
})

inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        getItemInput(e)
    }
})

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('submit-btn')) {
        getItemInput(e)
    }
    else if (e.target.type === "checkbox") {
        setChecked(e)
    }
    else if (e.target.classList.contains('delete-btn')) {
        removeItem(e)
    }
    else if (e.target.classList.contains('bookmark')) {
        setBookmarked(e)
        setSelectedQuest(e)
    }
    else if (e.target.closest('.list-item')) {
        setSelectedQuest(e)
    }
    else if (e.target.classList.contains('deadline-clear-btn')) {
        deadlinePickerInstance.clear()
        if (selectedQuestId) {
            const selectedQuest = itemArray.find((item) => item.id === selectedQuestId)
            if (selectedQuest) {
                selectedQuest.deadline = null
                localStorage.setItem("quests", JSON.stringify(itemArray))
            }
        }
        deadlineClearBtn.classList.add('hide-element')
    }
})

questDetailsTextarea.addEventListener('input', function() {
    getQuestDetails()
})

function setSelectedQuest(e) {
    itemArray.forEach((item) => {
        item.isSelected = false
    })
    const questId = e.target.closest('.list-item').dataset.id
    selectedQuestId = questId

    const selectedQuest = itemArray.find((item) => item.id === questId)
    selectedQuest.isSelected = true
    if (selectedQuest) {
        questTitle.textContent = selectedQuest.item
        questDetailsTextarea.value = selectedQuest.questDetails || ""
    }

    if (selectedQuest.deadline) {
        deadlineClearBtn.classList.remove('hide-element')
    } else {
        deadlineClearBtn.classList.add('hide-element')
    }
        
        bookmarkedDiv.style.display = selectedQuest.isBookmarked ? 'block' : 'none'
        deadlinePickerInstance.setDate(selectedQuest.deadline || null, false)

    renderList()
}

function getQuestDetails() {
    if (selectedQuestId) {
        const selectedQuest = itemArray.find((item) => item.id === selectedQuestId)
        if (selectedQuest) {
            selectedQuest.questDetails = questDetailsTextarea.value

            localStorage.setItem("quests", JSON.stringify(itemArray))
        }
    }
}

function sortArrayByBookmark() {
    itemArray.sort((a, b) => b.isBookmarked - a.isBookmarked)
}

function setBookmarked(e) {
    const bookmarkedItem = itemArray.find((item) => item.id === e.target.closest('.list-item').dataset.id)
    bookmarkedItem.isBookmarked = !bookmarkedItem.isBookmarked
    sortArrayByBookmark()
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
    itemArray.forEach((item) => {
        item.isSelected = false
    })
    if (inputField.value.trim() !== "") {
        const newQuest = {
            id: crypto.randomUUID(),
            item: toTitleCase(inputField.value),
            isChecked: false,
            questDetails: "",
            isBookmarked: false,
            isSelected: true,
            deadline: null
        }
        itemArray.push(newQuest)
        selectedQuestId = newQuest.id
    }
    const newQuest = itemArray[itemArray.length - 1]
    questTitle.textContent = newQuest.item
    questDetailsTextarea.value = newQuest.questDetails
    questDetailsTextarea.placeholder = "Enter quest details..."
    bookmarkedDiv.style.display = newQuest.isBookmarked ? 'block' : 'none'
    deadlinePickerInstance.setDate(newQuest.deadline, false)

    renderList()
}

function toTitleCase(str) {
    const smallWords = ["and", "or", "the", "in", "on", "of", "a", "an", "to", "but", "with"]
    
    return str
        .toLowerCase()
        .split(" ")
        .map((word, index) => 
            (index === 0 || !smallWords.includes(word))
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word
        )
        .join(" ")
}

function renderList() {
    let listItems = ""

    if (itemArray.length === 0) {
        questTitle.textContent = "There are no quests..."
        questDetailsTextarea.value = ""
        questDetailsTextarea.placeholder = "Add a quest to get started!"
        questDetailsTextarea.disabled = true
    } else {
        questDetailsTextarea.disabled = false
    }
    
    itemArray.forEach((item) => {
        listItems += `
            <div class="list-item ${item.isChecked ? 'checked' : ''} ${item.isSelected ? 'selected-quest' : ''}" data-id="${item.id}">
                <input type="checkbox" data-checkbox="${item.id}" ${item.isChecked ? 'checked' : ''}>
                <p>${item.item}</p>
                <div class="icons">
                    <img class="deadline-clock-img ${item.deadline ? '' : 'hide-element'}" id="deadline-clock" src="./images/deadline-clock-img.svg">
                    <img class="bookmark" src="${item.isBookmarked ? './images/bookmark-fill.svg' : './images/bookmark.svg'}" alt="A bookmark icon.">
                    <p class="delete-btn" data-delete="${item.id}">X</p>
                </div>
            </div>
        `
    })
    inputField.value = ""
    listContainer.innerHTML = listItems

    localStorage.setItem("quests", JSON.stringify(itemArray))
}