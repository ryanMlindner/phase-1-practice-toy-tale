const apiURL = "http://localhost:3000/toys"
const headers = {
  Accepts: "application/json",
  "Content-type": "application/json",
};
let toyArray = [];
const toysDiv = document.getElementById("toy-collection");
let addToy = false;

document.getElementById("toy-form").addEventListener("submit", addNewToy);

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch(apiURL)
    .then(res => res.json())
    .then(loadToys);
});

function loadToys(toys) {
  toyArray = toys;
  console.log(toyArray);
  renderToys();
}

function renderToys() {
  toysDiv.innerHTML = '';
  toyArray.forEach(displayToy);
}

function displayToy(toy) {
  const toyContainer = document.createElement("div");
  toyContainer.classList.add("card");

  const toyName = document.createElement("h2");

  const imgContainer = document.createElement("img");
  imgContainer.classList.add("toy-avatar");

  const likes = document.createElement("p");

  const button = document.createElement("button");
  button.classList.add("like-btn");
  button.innerText = "Like ❤️";

  toyName.innerText = toy.name;
  imgContainer.src = toy.image;
  likes.innerText = toy.likes;

  toyContainer.append(toyName);
  toyContainer.append(imgContainer);
  toyContainer.append(likes);
  toyContainer.append(button);
  
  toysDiv.append(toyContainer);
  button.addEventListener("click", () => {
    updateLikes(toy);
  });
}

function addNewToy(event) {
  event.preventDefault();
  const form = event.target;

  const newToy = {
    name: form.name.value,
    imgSrc: form.image.value,
    likes: 0,
  }

  fetch(apiURL, {
    headers,
    method: "POST",
    body: JSON.stringify(newToy),
  })
    .then(res => res.json())
    .then(json => {
      toyArray.push(json);
      renderToys();
    })
  form.reset();
}

function updateLikes(toy) {
  const id = toy.id;
  newLikes = toy.likes + 1;
  fetch(`${apiURL}/${id}`, {
    headers,
    method: "PATCH",
    body: JSON.stringify({"likes" : newLikes})
  })
    .then(res => res.json())
    .then(json => {
      toyArray[(id - 1)] = json;
      loadToys(toyArray);
      console.log(json);
    })
}