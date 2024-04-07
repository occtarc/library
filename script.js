const $buttonAdd = document.getElementById("add-book");
const $buttonSubmit = document.getElementById("enviar");
const $bookContainer = document.querySelector(".book-container");
const $modalWindow = document.querySelector(".modal-newbook");
const $spanError = document.querySelector(".error");
const arrayInputs = document.querySelectorAll("form input");
const inputsToArray = [...arrayInputs];
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
    deleteButton.setAttribute("data-index", cardBook.getAttribute("data-position"));
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
    console.log(library);
}

function cambiarEstadoLeido (boton, estado){
    if(estado){
        boton.style.backgroundColor = "#86efac"
        boton.textContent = "Leido";
    }else{
        boton.style.backgroundColor ="#fca5a5";
        boton.textContent = "No leido";
    }
    localStorage.setItem("Libreria", JSON.stringify(library));
}

function cargarLibreriaDesdeLocalStorage() {
    const storedLibrary = localStorage.getItem("Libreria");
    if (storedLibrary) {
        // Limpiar la biblioteca existente antes de cargar desde localStorage
        library.length = 0;
        const storedBooks = JSON.parse(storedLibrary);

        // Recorrer cada libro almacenado en localStorage
        storedBooks.forEach((storedBook) => {
            // Verificar si el libro ya está en la biblioteca
            const existingBookIndex = library.findIndex(book => book.name === storedBook.name);
            
            if (existingBookIndex === -1) {
                // Si el libro no existe en la biblioteca, añadirlo
                library.push(storedBook);
            }
        });

        // Crear las tarjetas de cada libro en la biblioteca
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
    $spanError.style.display = "none";
    const hasEmptyInput = inputsToArray.some((input) => {
        if(input.type === 'checkbox'){
            return false;
        }
        return input.value === '';
    });
    if (hasEmptyInput) {
        inputsToArray.forEach(input => console.log(input.value));
        $spanError.style.display = "inline-block";
        return;
    }
    $modalWindow.style.display = "none";
    crearObjetoBook();
    arrayInputs.forEach((input) => input.value = '');
    arrayInputs[3].checked = false;
    console.log(library);
});

cargarLibreriaDesdeLocalStorage();