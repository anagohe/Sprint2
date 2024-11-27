const baseURL = 'http://localhost:3000/api/books';
const reviewsURL = 'http://localhost:3000/api/reviews';

// Función genérica para manejar errores de fetch
const handleFetchError = (error, message) => {
    console.error(`${message}`, error);
    alert(`Error: ${message}. Detalles: ${error.message || 'Desconocido'}`);
};

// Validar campos vacíos y resaltar errores
function validateForm(fieldIds) {
    let isValid = true;
    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    return isValid;
}

// Limpiar un formulario
function clearForm(fields) {
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.value = '';
        field.classList.remove('is-invalid');
    });
}

// =====================
// FUNCIONES PARA LIBROS
// =====================

// Obtener libros
async function getBooks() {
    try {
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error('Error al obtener los libros');
        const books = await response.json();
        renderBooks(books);
        loadBookTitles(books);
    } catch (error) {
        handleFetchError(error, 'Error al obtener libros');
    }
}

// Renderizar libros en la tabla
function renderBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = books.map(book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${new Date(book.read_date).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-warning" onclick="editBook(${book.book_id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteBook(${book.book_id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Agregar un nuevo libro
async function saveBook() {
    const fieldIds = ['title', 'author', 'genre', 'read_date'];
    if (!validateForm(fieldIds)) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const bookData = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        read_date: document.getElementById('read_date').value.trim(),
    };

    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) throw new Error('Error al guardar el libro');
        const result = await response.json();
        alert(result.message || 'Libro agregado exitosamente.');
        getBooks();
        clearForm(fieldIds);
    } catch (error) {
        handleFetchError(error, 'Error al guardar el libro');
    }
}

// Editar libro
async function editBook(bookId) {
    try {
        const response = await fetch(`${baseURL}/${bookId}`);
        if (!response.ok) throw new Error('No se pudo obtener la información del libro');

        const book = await response.json();
        const formattedDate = book.read_date ? new Date(book.read_date).toISOString().split('T')[0] : '';

        document.getElementById('book_id').value = book.book_id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('genre').value = book.genre;
        document.getElementById('read_date').value = formattedDate;

        document.getElementById('saveBookBtn').style.display = 'none';
        document.getElementById('updateBookBtn').style.display = 'inline-block';
    } catch (error) {
        handleFetchError(error, 'Error al cargar el libro');
    }
}

// Guardar cambios en un libro editado
async function updateBook() {
    const fieldIds = ['book_id', 'title', 'author', 'genre', 'read_date'];
    if (!validateForm(fieldIds.slice(1))) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const bookId = document.getElementById('book_id').value;
    const bookData = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        read_date: document.getElementById('read_date').value.trim(),
    };

    try {
        const response = await fetch(`${baseURL}/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) throw new Error('Error al actualizar el libro');
        const result = await response.json();
        alert(result.message || 'Libro actualizado exitosamente.');
        getBooks();
        clearForm(fieldIds);

        document.getElementById('saveBookBtn').style.display = 'inline-block';
        document.getElementById('updateBookBtn').style.display = 'none';
    } catch (error) {
        handleFetchError(error, 'Error al actualizar el libro');
    }
}

// Eliminar libro
async function deleteBook(bookId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) return;

    try {
        const response = await fetch(`${baseURL}/${bookId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el libro');
        const result = await response.json();
        alert(result.message || 'Libro eliminado exitosamente.');
        getBooks();
    } catch (error) {
        handleFetchError(error, 'Error al eliminar el libro');
    }
}

// =====================
// FUNCIONES PARA RESEÑAS
// =====================

function loadBookTitles(books) {
    const bookSelect = document.getElementById('reviewBookTitle');
    bookSelect.innerHTML = '<option value="" selected disabled>Seleccione un libro</option>';
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.book_id;
        option.textContent = book.title;
        bookSelect.appendChild(option);
    });
}

async function getReviews() {
    try {
        const response = await fetch(reviewsURL);
        if (!response.ok) throw new Error('Error al obtener las reseñas');
        const reviews = await response.json();
        renderReviews(reviews);
    } catch (error) {
        handleFetchError(error, 'Error al obtener reseñas');
    }
}

function renderReviews(reviews) {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.book_title || 'Título no disponible'}</td>
            <td>${review.rating}</td>
            <td>${review.review_text}</td>
            <td>${new Date(review.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-warning">Editar</button>
                <button class="btn btn-danger">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

async function addReview() {
    const fields = ['reviewBookTitle', 'reviewRating', 'reviewText'];

    if (!validateForm(fields)) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const reviewData = {
        book_id: document.getElementById('reviewBookTitle').value,
        rating: parseInt(document.getElementById('reviewRating').value.trim(), 10),
        review_text: document.getElementById('reviewText').value.trim(),
    };

    try {
        const response = await fetch(reviewsURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) throw new Error('Error al agregar la reseña');
        const result = await response.json();
        alert(result.message || 'Reseña agregada exitosamente.');
        getReviews();
        clearForm(fields);
    } catch (error) {
        handleFetchError(error, 'Error al agregar la reseña');
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    getBooks();
    getReviews();
    document.getElementById('saveBookBtn').addEventListener('click', saveBook);
    document.getElementById('updateBookBtn').addEventListener('click', updateBook);
});

// Exponer funciones globalmente
window.editBook = editBook;
window.updateBook = updateBook;
window.deleteBook = deleteBook;
window.addReview = addReview;
