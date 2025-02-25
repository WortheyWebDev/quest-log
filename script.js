import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "./firebase-config.js";

const inputField = document.querySelector('.input-field')
const submitBtn = document.querySelector('.submit-btn')
const listContainer = document.querySelector('.list-container')
const questDetailsTextarea = document.querySelector('.quest-details')
const questTitle = document.querySelector('.quest-title')

let itemArray = []
let selectedQuestId = null

async function loadQuests() {
    itemArray = []
    const querySnapshot = await getDocs(collection(db, "quests"))

    querySnapshot.forEach((doc) => {
        itemArray.push({ id: doc.id, ...doc.data() })
    })

    renderList()
}

document.addEventListener("DOMContentLoaded", loadQuests)

document.addEventListener('click', async function(e) {
    if (e.target.tagName === 'BUTTON') {
        await getItemInput(e)
        renderList()
    }
    else if (e.target.type === "checkbox") {
        setChecked(e)
    }
    else if (e.target.classList.contains('delete-btn')) {
        removeItem(e)
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

async function getQuestDetails() {
    if (selectedQuestId) {
        const selectedQuest = itemArray.find((item) => item.id === selectedQuestId)
        if (selectedQuest) {
            selectedQuest.questDetails = questDetailsTextarea.value

            await updateDoc(doc(db, "quests", selectedQuest.id), {
                questDetails: selectedQuest.questDetails
            })
        }
    }
}

async function removeItem(e) {
    const itemId = e.target.dataset.delete

    if (!itemId) return

    try {    
        await deleteDoc(doc(db, "quests", itemId))
        itemArray = itemArray.filter((item) => item.id !== itemId)
        renderList()
    } catch (error) {
        console.error("Error removing document:", error)
    }
}

async function setChecked(e) {
    const checkedItem = itemArray.find((checkedItem) => checkedItem.id === e.target.dataset.checkbox)
    if (checkedItem) {
        checkedItem.isChecked = !checkedItem.isChecked
        
        await updateDoc(doc(db, "quests", checkedItem.id), {
            isChecked: checkedItem.isChecked
        })
        renderList()
    }
}

async function getItemInput(e) {
    if (inputField.value.trim() !== "") {
        const newQuest = {
            id: crypto.randomUUID(),
            item: inputField.value,
            isChecked: false,
            questDetails: ""
        }

        const docRef = await addDoc(collection(db, "quests"), newQuest)
        newQuest.id = docRef.id
        itemArray.push(newQuest)
        renderList()
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
                <p class="delete-btn" data-delete="${item.id}">X</p>
            </div>
        `
    })
    inputField.value = ""
    listContainer.innerHTML = listItems
}