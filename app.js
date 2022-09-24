const todosList = document.querySelector(".todos-list");
const todoInput = document.querySelector(".form__input");
const todoForm = document.querySelector("form");
const todoContainer = document.querySelector(".todos-container");
const ctas = document.querySelectorAll(".cta");
const itemLeft = document.querySelector(".items-left");
const clearBtn = document.querySelector(".clear");
const themeBtn = document.querySelector(".theme-btn");
const themeBtnImgs = document.querySelectorAll(".theme-btn img");
const bgImages = document.querySelectorAll(".top-bg_image");
const cercles = document.querySelectorAll(".cercle");
const todoCercles = document.querySelectorAll(".todo-cercle");
const todoListMob = document.querySelector(".ctas-mob");
let state = [];
let idCounter = 0;

// Helper functions
const storeInLocalStorage = () => {
  localStorage.setItem("state", JSON.stringify(state));
};

const getStateFromLocalStorage = () => {
  // Guard condition to avoid errors
  if (localStorage.getItem("state") === null) return;
  // Get the state from local storage to work with it
  state = JSON.parse(localStorage.getItem("state"));
};

const itemsLeftUpdate = () => {
  itemLeft.textContent = `${state.length} items left`;
};

const toggleDarkMode = (el) => {
  el.classList.toggle("dark");
};

// Handler functions
const cerclesHandler = () => {
  const cercles = document.querySelectorAll(".todo-cercle");
  cercles.forEach((cercle) => {
    cercle.addEventListener("click", function () {
      const parentEl = cercle.closest(".todo-item");
      // Update UI
      parentEl.classList.toggle("completed");

      // Update state
      state
        .filter((item) => item.id === parentEl.getAttribute("aria-id"))
        .forEach((item) => (item.isComplete = !item.isComplete));
      storeInLocalStorage();
    });
  });
};
const deleteHandler = () => {
  const deletes = document.querySelectorAll(".delete");
  deletes.forEach((delet) => {
    delet.addEventListener("click", function () {
      const parentEl = delet.closest(".todo-item");

      parentEl.classList.remove("show-todo");
      parentEl.classList.add("unshow-todo");
      // Update UI

      setTimeout(() => {
        parentEl.remove();
      }, 300);
      // Update state
      state = state.filter(
        (item) => item.id !== parentEl.getAttribute("aria-id")
      );
      itemsLeftUpdate();
      storeInLocalStorage();
    });
  });
};

ctas.forEach((cta) =>
  cta.addEventListener("click", function (e) {
    // Update UI
    ctas.forEach((cta) => cta.classList.remove("active"));
    cta.classList.add("active");

    // Update UI for each condition to show the wanted results
    if (cta.textContent.toLowerCase() === "completed" && state.length > 0) {
      todosList.innerHTML = "";
      state
        .filter((data) => data.isComplete === true)
        .map((data) => {
          createMarkup(data);
        });
    }
    if (cta.textContent.toLowerCase() === "active" && state.length > 0) {
      todosList.innerHTML = "";
      state
        .filter((data) => data.isComplete === false)
        .map((data) => {
          createMarkup(data);
        });
    }

    if (cta.textContent.toLowerCase() === "all" && state.length > 0) {
      todosList.innerHTML = "";
      state.map((data) => createMarkup(data));
    }

    // Add Handlers to add functionalities
    cerclesHandler();
    deleteHandler();
  })
);

clearBtn.addEventListener("click", function () {
  // Guard close to avoid any unnecessary animations
  if (state.filter((item) => item.isComplete === true).length === 0) return;
  // Modify the state array by removing the completed todos
  state = state.filter((item) => item.isComplete !== true);
  // Update UI
  createTodoItem(state);
  itemsLeftUpdate();
  // Store in Local storage
  storeInLocalStorage();
});
const createMarkup = (item) => {
  const markup = `
  <li class="todo-item show-todo ${
    item.isComplete ? "completed" : ""
  }" aria-id=${item.id}>
    <button class="btn cercle todo-cercle">
      <img src="./images/icon-check.svg" alt="" />
    </button>
    <h2 class="todo-text">${item.text}</h2>
    <button class="btn delete">
      <img src="./images/icon-cross.svg" alt="" />
    </button>
  </li>
  `;
  todosList.insertAdjacentHTML("beforeend", markup);
};
const createTodoItem = (data) => {
  // Update UI
  todosList.innerHTML = "";
  data.map((item) => {
    createMarkup(item);
  });

  // Add Handlers to add functionalities
  cerclesHandler();
  deleteHandler();
};

const formHandler = (e) => {
  e.preventDefault();
  if (todoInput.value.trim().length === 0) return;
  idCounter++;
  // Modify state with every form submition
  state = [
    ...state,
    {
      id: `e${idCounter}`,
      text: todoInput.value,
      isComplete: false,
    },
  ];
  // Update UI
  itemsLeftUpdate();
  createTodoItem(state);
  todoInput.value = "";

  // Store in Local Storage
  storeInLocalStorage();
};
todoForm.addEventListener("submit", formHandler);

const init = () => {
  // Get state from Locale Storage
  getStateFromLocalStorage();
  // Update UI
  createTodoItem(state);
  ctas[0].classList.add("active");
  itemsLeftUpdate();
};
init();

themeBtn.addEventListener("click", function () {
  toggleDarkMode(document.querySelector("body"));
  toggleDarkMode(todoForm);
  toggleDarkMode(todoContainer);
  toggleDarkMode(cercles[0]);
  toggleDarkMode(todoListMob);

  themeBtnImgs.forEach((img) => img.classList.toggle("icon-unshow"));
  bgImages.forEach((img) => img.classList.toggle("top-bg_image-show"));
});
