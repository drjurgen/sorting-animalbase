"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let currentFilter = "*";
let currentSort;
let sortDirection;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  hasStar: false,
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons
  document.querySelectorAll(".filter").forEach((knap) => {
    knap.addEventListener("click", selectFilter);
  });

  document.querySelectorAll("#sorting th").forEach((knap) => {
    knap.addEventListener("click", selectSort);
  });
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first

  displayList(allAnimals);

  document.querySelectorAll(".star").forEach((knap) => {
    knap.addEventListener("click", getStarClick);
  });
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

// FILTERING BELOW
// FILTERING BELOW
// FILTERING BELOW
function selectFilter() {
  const clicledFilter = this.dataset.filter;
  setFilter(clicledFilter);
}

function setFilter(clickedFilter) {
  currentFilter = clickedFilter;
  console.log(currentFilter);
  buildList();
}

function filterList(allAnimals) {
  const list = allAnimals.filter((animal) => animal.type === currentFilter);
  if (currentFilter === "*") {
    return allAnimals;
  } else {
    return list;
  }
}

// SORTING BELOW
// SORTING BELOW
// SORTING BELOW
function selectSort() {
  const clickedSort = this.dataset.sort;
  const direction = this.dataset.sortDirection;
  setSort(clickedSort, direction);

  const clickedSortButton = this;
  changeSortDirection(clickedSortButton, direction);
}

function changeSortDirection(clickedSortButton, direction) {
  document.querySelectorAll("#sorting th").forEach((knap) => {
    knap.dataset.sortDirection = "asc";
    knap.querySelector("i").classList = "";
  });

  if (direction === "asc") {
    clickedSortButton.dataset.sortDirection = "desc";
    clickedSortButton.querySelector("i").classList = "arrow up";
  } else {
    clickedSortButton.dataset.sortDirection = "asc";
    clickedSortButton.querySelector("i").classList = "arrow down";
  }
}

function setSort(clickedSort, direction) {
  currentSort = clickedSort;
  sortDirection = direction;
  console.log(currentSort, sortDirection);
  buildList();
}

function sortList(currentList) {
  let sortedList;
  if (currentSort === "name") {
    sortedList = currentList.sort(sortName);
  } else if (currentSort === "type") {
    sortedList = currentList.sort(sortType);
  } else if (currentSort === "desc") {
    sortedList = currentList.sort(sortDesc);
  } else if (currentSort === "age") {
    sortedList = currentList.sort(sortAge);
  } else if (currentSort === "star") {
    sortedList = currentList.sort(sortStar);
  } else {
    sortedList = currentList;
  }
  return sortedList;
}

function sortStar(a, b) {
  if (sortDirection === "asc") {
    if (b.hasStar < a.hasStar) {
      return -1;
    } else {
      return 1;
    }
  } else {
    if (a.hasStar < b.hasStar) {
      return -1;
    } else {
      return 1;
    }
  }
}

function sortName(a, b) {
  if (sortDirection === "asc") {
    return a.name.localeCompare(b.name);
  } else {
    return b.name.localeCompare(a.name);
  }
}

function sortType(a, b) {
  if (sortDirection === "asc") {
    return a.type.localeCompare(b.type);
  } else {
    return b.type.localeCompare(a.type);
  }
}

function sortDesc(a, b) {
  if (sortDirection === "asc") {
    return a.desc.localeCompare(b.desc);
  } else {
    return b.desc.localeCompare(a.desc);
  }
}

function sortAge(a, b) {
  if (sortDirection === "asc") {
    return a.age - b.age;
  } else {
    return b.age - a.age;
  }
}

// BUILD LIST BELOW
// BUILD LIST BELOW
// BUILD LIST BELOW
function buildList() {
  const currentList = filterList(allAnimals);
  sortList(currentList);
  displayList(currentList);

  document.querySelectorAll(".star").forEach((knap) => {
    knap.addEventListener("click", getStarClick);
  });
}

// STAR BELOW
// STAR BELOW
// STAR BELOW
function getStarClick() {
  const clickedAnimal = this.parentElement.querySelector("td:nth-child(2)").textContent;
  setStar(clickedAnimal);
}

function setStar(clickedAnimal) {
  const clickedAnimalObject = allAnimals.find((animal) => animal.name === clickedAnimal);

  console.log(clickedAnimalObject);

  clickedAnimalObject.hasStar = !clickedAnimalObject.hasStar;
  console.log(clickedAnimalObject.hasStar);

  buildList();
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  if (animal.hasStar === false) {
    clone.querySelector("[data-field=star]").textContent = "☆";
  } else {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
