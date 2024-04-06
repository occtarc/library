const $buttonAdd = document.getElementById("add-book");
const $buttonSubmit = document.getElementById("enviar");
const $bookContainer = document.querySelector(".book-container");
const $modalWindow = document.querySelector(".modal-newbook");
const arrayInputs = document.querySelectorAll("form input");
const library = [];

function Book (name,autor,pags,read){
    this.name = name;
    this.autor = autor;
    this.pags = pags;
    this.read = read;
}

function crearObjetoBook(){
    const name = arrayInputs[0].value;
    const autor = arrayInputs[1].value;
    const pags = arrayInputs[2].value;
    const read = arrayInputs[3].checked;

    const newBook = new Book(name,autor,pags,read);
    library.push(newBook);
    localStorage.setItem("Libreria", JSON.stringify(library));
    crearCardBook(newBook);
}

function crearCardBook (newBook) {
    const cardBook = document.createElement("div");
    cardBook.classList.add("card-book");
    cardBook.setAttribute("data-position", `${library.length-1}`);
    cardBook.innerHTML = `
    <p class="p-title"> Libro: ${newBook.name} </p>
    <p> Autor: ${newBook.autor} </p>
    <p> Páginas: ${newBook.pags} </p>`;
    const buttonRead = document.createElement("button");
    buttonRead.classList.add("read");
    cambiarEstadoLeido(buttonRead, newBook.read);
    buttonRead.addEventListener("click",() => {
        newBook.read = !newBook.read;
        cambiarEstadoLeido(buttonRead, newBook.read);
    })
    cardBook.appendChild(buttonRead);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("delete");
    deleteButton.setAttribute("data-index", library.length - 1);
    deleteButton.addEventListener("click", () => {
        eliminarCardBook(deleteButton.getAttribute("data-index"));
        cardBook.remove();
    });
    cardBook.appendChild(deleteButton);
    $bookContainer.appendChild(cardBook);
}

function eliminarCardBook (botonId){
    library.splice(botonId,1);
    localStorage.setItem("Libreria", JSON.stringify(library));
}

function cambiarEstadoLeido (boton, estado){
    if(estado){
        boton.style.backgroundColor = "#86efac"
        boton.textContent = "Leido";
    }else{
        boton.style.backgroundColor ="#fca5a5";
        boton.textContent = "No leido";
    }
}

function cargarLibreriaDesdeLocalStorage() {
    const storedLibrary = localStorage.getItem("Libreria");
    if (storedLibrary) {
        // Convertir la cadena JSON de localStorage de vuelta a un array
        library.push(...JSON.parse(storedLibrary));
        // Recorrer el array library para crear las tarjetas de cada libro
        library.forEach((book) => {
            crearCardBook(book);
        });
    }
}

$buttonAdd.addEventListener("click", () => {
    $modalWindow.style.display = "flex";
})

$buttonSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    $modalWindow.style.display = "none";
    crearObjetoBook();
    arrayInputs.forEach((input) => input.value = '');
    console.log(library);
});

cargarLibreriaDesdeLocalStorage();