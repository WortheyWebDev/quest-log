// DOM elements
const inputField = document.querySelector('.input-field');
const submitBtn = document.querySelector('.submit-btn');
const listContainer = document.querySelector('.list-container');
const questDetailsTextarea = document.querySelector('.quest-details');
const questTitle = document.querySelector('.quest-title');
const bookmarkedDiv = document.querySelector('.bookmarked-div');
const deadlinePicker = document.getElementById('deadline-picker');
const deadlineClearBtn = document.querySelector('.deadline-clear-btn');

// Flatpickr instance with callback for deadline changes
const deadlinePickerInstance = flatpickr("#deadline-picker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    altInput: true,
    altInputClass: "flatpickr-style",
    altFormat: "M j, Y (h:i K)",
    onChange: editDeadline
});

let itemArray = [];
let selectedQuestId = null;

/* ===== Helper Functions ===== */

// Save current quests array to localStorage.
const updateStorage = () => localStorage.setItem("quests", JSON.stringify(itemArray))

// Set all quests as not selected.
const deselectAll = () => itemArray.forEach(item => item.isSelected = false)

// Retrieve the currently selected quest.
const getSelectedQuest = () => itemArray.find(item => item.id === selectedQuestId)

// Sanitize user input
function sanitizeInput(input) {
    const div = document.createElement("div")
    div.textContent = input
    return div.innerHTML
}

// Update the quest details pane based on the provided quest.
function updateSelectedQuestDisplay(quest) {
    questTitle.textContent = quest ? quest.item : "There are no quests...";
    questDetailsTextarea.value = quest ? (quest.questDetails || "") : "";
    bookmarkedDiv.style.display = (quest && quest.isBookmarked) ? 'block' : 'none';
    if (quest && quest.deadline) {
        deadlineClearBtn.classList.remove('hide-element');
    } else {
        deadlineClearBtn.classList.add('hide-element');
    }
    deadlinePickerInstance.setDate(quest ? quest.deadline : null, false);
}

// Check quests with deadlines and flag if one hour or less remains
function checkDeadlines() {
    const now = new Date();
    itemArray.forEach(quest => { 
        if (quest.deadline) {
            const deadlineTime = new Date(quest.deadline);
            const diff = deadlineTime - now;
            quest.urgent = diff > 0 && diff <= 3600000;
        } else {
            quest.urgent = false;
        }
    });
    renderList();
}

/* ===== Event Handlers ===== */

// Update deadline for selected quest.
function editDeadline(selectedDates, dateStr) {
    const selectedQuest = getSelectedQuest();
    if (selectedQuest) {
        selectedQuest.deadline = dateStr;
        updateStorage();
    }
    deadlineClearBtn.classList.toggle('hide-element', !dateStr);
    checkDeadlines();
}

// Initialize from localStorage once the document loads.
document.addEventListener('DOMContentLoaded', () => {
    const savedQuests = localStorage.getItem("quests");
    if (savedQuests) {
        itemArray = JSON.parse(savedQuests);
        if (itemArray.length > 0) {
            // Select first quest by default.
            deselectAll();
            itemArray[0].isSelected = true;
            selectedQuestId = itemArray[0].id;
            updateSelectedQuestDisplay(itemArray[0]);
            // Show bookmarked indicator if needed.
            if (itemArray[0].isBookmarked) {
                bookmarkedDiv.style.display = 'block';
            }
        }
    }
    renderList();
});

// Keydown event on input field to add quest when Enter is pressed.
inputField.addEventListener('keydown', e => {
    if (e.key === 'Enter') getItemInput(e);
});

// Global click event delegation.
document.addEventListener('click', e => {
    if (e.target.classList.contains('submit-btn')) {
        getItemInput(e);
    } else if (e.target.type === "checkbox") {
        setChecked(e);
    } else if (e.target.classList.contains('delete-btn')) {
        removeItem(e);
    } else if (e.target.classList.contains('bookmark')) {
        const questId = e.target.closest('.list-item').dataset.id;
        setBookmarked(e);
        setSelectedQuest(questId);
    } else if (e.target.closest('.list-item')) {
        const questId = e.target.closest('.list-item').dataset.id;
        setSelectedQuest(questId);
    } else if (e.target.classList.contains('deadline-clear-btn')) {
        deadlinePickerInstance.clear();
        const selectedQuest = getSelectedQuest();
        if (selectedQuest) {
            selectedQuest.deadline = null;
            updateStorage();
        }
        deadlineClearBtn.classList.add('hide-element');
    }
});

// Update quest details on input.
questDetailsTextarea.addEventListener('input', getQuestDetails);

/* ===== Core Functions ===== */

// When a quest is selected from the list.
function setSelectedQuest(questId) {
    deselectAll();
    selectedQuestId = questId;
    const selectedQuest = itemArray.find(item => item.id === questId);
    if (selectedQuest) {
        selectedQuest.isSelected = true;
        updateSelectedQuestDisplay(selectedQuest);
    }
    renderList();
}

// Update the quest details for the selected quest.
function getQuestDetails() {
    const selectedQuest = getSelectedQuest();
    if (selectedQuest) {
        selectedQuest.questDetails = questDetailsTextarea.value;
        updateStorage();
    }
}

// Toggle bookmark status for a quest.
function setBookmarked(e) {
    const questId = e.target.closest('.list-item').dataset.id;
    const quest = itemArray.find(item => item.id === questId);
    if (quest) {
        quest.isBookmarked = !quest.isBookmarked;
        sortArrayByBookmark();
        renderList();
    }
}

// Remove a quest from the list.
function removeItem(e) {
    const itemId = e.target.dataset.delete;
    const quest = itemArray.find(item => item.id === itemId)
    itemArray = itemArray.filter(item => item.id !== itemId);
    if (quest.isSelected && itemArray.length > 0) {
        setSelectedQuest(itemArray[itemArray.length - 1].id);
    }
    if (itemArray.length === 0) {
        deadlinePickerInstance.clear();
        deadlineClearBtn.classList.add('hide-element');
    }
    updateStorage();
    renderList();
}

// Toggle the checked state of a quest.
function setChecked(e) {
    const questId = e.target.dataset.checkbox;
    const quest = itemArray.find(item => item.id === questId);
    if (quest) {
        quest.isChecked = !quest.isChecked;
        renderList();
    }
}

// Add a new quest based on user input.
function getItemInput(e) {
    deselectAll();
    if (inputField.value.trim() !== "") {
        const newQuest = {
            id: crypto.randomUUID(),
            item: toTitleCase(sanitizeInput(inputField.value)),
            isChecked: false,
            questDetails: "",
            isBookmarked: false,
            isSelected: true,
            deadline: null,
            urgent: false
        };
        itemArray.push(newQuest);
        selectedQuestId = newQuest.id;
        updateSelectedQuestDisplay(newQuest);
        // Reset deadline clear button state.
        deadlineClearBtn.classList.add('hide-element');
    }
    renderList();
}

// Convert a string to title case with exceptions.
function toTitleCase(str) {
    const smallWords = ["and", "or", "the", "in", "on", "of", "a", "an", "to", "but", "with"];
    return str
        .toLowerCase()
        .split(" ")
        .map((word, index) => (index === 0 || !smallWords.includes(word))
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word)
        .join(" ");
}

// Sort quests so that bookmarked items appear first.
const sortArrayByBookmark = () => itemArray.sort((a, b) => b.isBookmarked - a.isBookmarked)


// Render the quest list and update localStorage.
function renderList() {
    let listItems = "";
    if (itemArray.length === 0) {
        questTitle.textContent = "There are no quests...";
        questDetailsTextarea.value = "";
        questDetailsTextarea.placeholder = "Add a quest to get started!";
        questDetailsTextarea.disabled = true;
        deadlineClearBtn.classList.add('hide-element');
    } else {
        questDetailsTextarea.disabled = false;
    }
    itemArray.forEach(({ id, item, isChecked, questDetails, isBookmarked, isSelected, deadline, urgent }) => {
        listItems += `
            <div class="list-item ${isChecked ? 'checked' : ''} ${urgent ? 'urgent' : ''} ${isSelected ? 'selected-quest' : ''}" data-id="${id}">
                <input type="checkbox" data-checkbox="${id}" ${isChecked ? 'checked' : ''}>
                <p>${item}</p>
                <div class="icons">
                    <img class="deadline-clock-img ${deadline ? '' : 'hide-element'}" id="deadline-clock" src="./images/deadline-clock-img.svg">
                    <img class="bookmark" src="${isBookmarked ? './images/bookmark-fill.svg' : './images/bookmark.svg'}" alt="A bookmark icon.">
                    <p class="delete-btn" data-delete="${id}">X</p>
                </div>
            </div>
        `;
    });
    inputField.value = "";
    listContainer.innerHTML = listItems;
    updateStorage();
}

setInterval(checkDeadlines, 60000);