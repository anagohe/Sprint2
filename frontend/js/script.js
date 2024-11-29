const apiUrl = 'http://localhost:3001/api'; // Cambiar esto si es necesario

async function fetchBooks() {
    try {
        const response = await fetch(`${apiUrl}/libros`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error al obtener libros:', error);
    }
}

async function fetchQuotes() {
    try {
        const response = await fetch(`${apiUrl}/citas`);
        const quotes = await response.json();
        displayQuotes(quotes);
    } catch (error) {
        console.error('Error al obtener citas:', error);
    }
}

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Limpiar la lista

    books.forEach((book) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-card');  // Clase de tarjeta
        bookElement.innerHTML = `
            <h3>${book.titulo} (${book.genero})</h3>
            <p>Autor: ${book.autor}</p>
            <p>Fecha leída: ${book.fecha_leida}</p>
            <p>Calificación: ${book.calificacion}/5</p>
            <p>Reseña: ${book.reseña}</p>
            <button onclick="showEditBookForm(${book.id})">Editar</button>
            <button onclick="deleteBook(${book.id})">Eliminar</button>
        `;
        bookList.appendChild(bookElement);
    });
}

function displayQuotes(quotes) {
    const quoteList = document.getElementById('quote-list');
    quoteList.innerHTML = ''; // Limpiar la lista
    quotes.forEach((quote) => {
        const quoteElement = document.createElement('div');
        quoteElement.innerHTML = `
            <p>"${quote.cita}" - ${quote.libro_id ? `Libro ID: ${quote.libro_id}` : 'Sin libro'} de ${quote.autor}</p>
            <button onclick="deleteQuote(${quote.id})">Eliminar</button>
        `;
        quoteList.appendChild(quoteElement);
    });
}

document.getElementById('book-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const libroId = formData.get('bookId');
    const newBook = {
        titulo: formData.get('titulo'),
        genero: formData.get('genero'),
        autor: formData.get('autor'),
        fecha_leida: formData.get('fecha_leida'),
        calificacion: parseInt(formData.get('calificacion'), 10),
        reseña: formData.get('reseña'),
        privado: formData.get('privado') === 'true',
    };

    try {
        const url = libroId ? `${apiUrl}/libros/${libroId}` : `${apiUrl}/libros`;
        const method = libroId ? 'PUT' : 'POST';

        console.log(`Enviando a ${url} con método ${method}`, newBook);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar libro: ${response.statusText}`);
        }

        event.target.reset();
        fetchBooks();
    } catch (error) {
        console.error('Error al agregar o editar libro:', error);
    }
});

async function fetchBookById(id) {
    const response = await fetch(`${apiUrl}/libros/${id}`);
    console.log("ID del libro que se está recuperando:", id);
    if (!response.ok) {
        throw new Error(`Error al obtener el libro: ${response.statusText}`);
    }
    return await response.json();
}

function openEditModal() {
    document.getElementById("edit-modal").style.display = "block";
}

async function showEditBookForm(id) {
    try {
        const book = await fetchBookById(id);

        const form = document.getElementById('edit-book-form');
        form.elements['bookId'].value = book.id;
        form.elements['titulo'].value = book.titulo;
        form.elements['genero'].value = book.genero;
        form.elements['autor'].value = book.autor;
        form.elements['fecha_leida'].value = book.fecha_leida;
        form.elements['calificacion'].value = book.calificacion;
        form.elements['reseña'].value = book.reseña;
        form.elements['privado'].checked = book.privado;

        openEditModal();
    } catch (error) {
        console.error('Error al obtener libro para edición:', error);
    }
}

document.getElementById('edit-book-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const libroId = formData.get('bookId');
    const updatedBook = {
        titulo: formData.get('titulo'),
        genero: formData.get('genero'),
        autor: formData.get('autor'),
        fecha_leida: formData.get('fecha_leida'),
        calificacion: parseInt(formData.get('calificacion'), 10),
        reseña: formData.get('reseña'),
        privado: formData.get('privado') === 'on',
    };

    try {
        const response = await fetch(`${apiUrl}/libros/${libroId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBook),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar libro: ${response.statusText}`);
        }

        closeEditModal();
        fetchBooks();
    } catch (error) {
        console.error('Error al actualizar libro:', error);
    }
});

window.onclick = function (event) {
    const modal = document.getElementById("edit-modal");
    if (event.target === modal) {
        closeEditModal();
    }
};

async function deleteBook(id) {
    try {
        await fetch(`${apiUrl}/libros/${id}`, { method: 'DELETE' });
        fetchBooks();
    } catch (error) {
        console.error('Error al eliminar libro:', error);
    }
}

document.getElementById('quote-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newQuote = {
        cita: formData.get('cita'),
        libro_id: formData.get('libro_id') ? parseInt(formData.get('libro_id'), 10) : null,
        autor: formData.get('autor'),
        privado: formData.get('privado') === 'true',
    };

    try {
        await fetch(`${apiUrl}/citas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newQuote),
        });
        event.target.reset();
        fetchQuotes();
    } catch (error) {
        console.error('Error al agregar cita:', error);
    }
});

async function deleteQuote(id) {
    try {
        await fetch(`${apiUrl}/citas/${id}`, { method: 'DELETE' });
        fetchQuotes();
    } catch (error) {
        console.error('Error al eliminar cita:', error);
    }
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

let allBooks = [];

function filterBooks() {
    const filterAuthor = document.getElementById('filter-author').value.toLowerCase();
    const filterGenre = document.getElementById('filter-genre').value.toLowerCase();

    const filteredBooks = allBooks.filter((book) => {
        const isAuthorMatch = book.autor.toLowerCase().includes(filterAuthor);
        const isGenreMatch = book.genero.toLowerCase().includes(filterGenre);
        return isAuthorMatch && isGenreMatch;
    });

    displayBooks(filteredBooks);
}

document.getElementById('filter-button').addEventListener('click', filterBooks);

// Cargar los libros y citas al inicio
fetchBooks();
fetchQuotes();