const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearButton = document.getElementById("clear");
const items = itemList.querySelectorAll("li");
const itemFilter = document.getElementById("filter");
const addButton = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStrorage();

  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  //Validate Input
  if (newItem === "") {
    alert("Please add item");
    return;
  }

  // Check for Edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemfromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("That items already exist");
      return;
    }
  }

  // Create item and add to DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStotage(newItem);

  checkUI();

  itemInput.value = "";
}

function addItemToDOM(item) {
  // Create List Item
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");

  li.appendChild(button);

  //Add li to the DOM
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStotage(item) {
  const itemsFromStorage = getItemsFromStrorage();
  // Add the new item to local storage
  itemsFromStorage.push(item);

  // Convert to JSON String and set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStrorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStrorage = getItemsFromStrorage();

  return itemsFromStrorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  addButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  itemInput.value = item.textContent;
  addButton.style.backgroundColor = "#228B22";
}

function removeItem(item) {
  if (confirm("Are you sure ?")) {
    //Remove item from DOM
    item.remove();

    // Remove from Local Storage
    removeItemfromStorage(item.textContent);

    checkUI();
  }
}

function removeItemfromStorage(item) {
  let itemsFromStorage = getItemsFromStrorage();

  // Filter items to be remove
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Re reset to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear all items from local storage
  localStorage.removeItem("items");
  checkUI();
}

function checkUI() {
  itemInput.value = "";
  if (!itemList.firstElementChild) {
    clearButton.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    itemFilter.style.display = "block";
  }
  addButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  addButton.style.backgroundColor = "#333";

  isEditMode = false;
}

function filterItem(e) {
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function init() {
  //Event Listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearButton.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItem);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}
init();

// localStorage.setItem("name", "Brad");   Set a value with a key
// localStorage.getItem("name");  Get a value using key
// localStorage.removeItem("name");  remove item using key
// localStorage.clear();  Clear all value
