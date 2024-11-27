const baseURL = 'http://localhost:3001/api/books';
const reviewsURL = 'http://localhost:3001/api/reviews';

// Función genérica para manejar errores de fetch
const handleFetchError = (error, message) => {
    console.error(message, error);
    alert('Ocurrió un error, intenta nuevamente.');
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

// Renderizar libros en la tabla
function renderBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = books.length
        ? books.map(book => `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.read_date ? new Date(book.read_date).toLocaleDateString() : ''}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editBook(${book.book_id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.book_id})">Eliminar</button>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="archiveBook(${book.book_id})">Archivar</button>
                </td>
            </tr>
        `).join('')
        : '<tr><td colspan="6" class="text-center">No hay libros disponibles</td></tr>';
}

// Obtener libros
async function getBooks(filter = {}) {
    try {
        const params = new URLSearchParams(filter).toString();
        const url = params ? `${baseURL}?${params}` : baseURL;

        const response = await fetch(url);
        const data = await response.json();
        renderBooks(data);
    } catch (error) {
        handleFetchError(error, 'Error al obtener libros:');
    }
}

// Guardar un nuevo libro
async function saveBook() {
    const fieldIds = ['title', 'author', 'genre', 'read_date'];
    if (!validateForm(fieldIds)) {
        alert('Todos los campos son obligatorios. Por favor, completa el formulario.');
        return;
    }

    const bookData = Object.fromEntries(
        fieldIds.map(id => [id, document.getElementById(id).value.trim()])
    );

    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        const result = await response.json();
        alert(result.message);
        getBooks();
        clearForm(fieldIds);
    } catch (error) {
        handleFetchError(error, 'Error al guardar el libro:');
    }
}

// Editar libro
async function editBook(bookId) {
    try {
        const response = await fetch(`${baseURL}/${bookId}`);
        const book = await response.json();

        ['book_id', 'title', 'author', 'genre', 'read_date'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.value = book[fieldId] || (fieldId === 'read_date' ? book.read_date.split('T')[0] : '');
        });

        document.getElementById('saveBookBtn').style.display = 'none';
        document.getElementById('updateBookBtn').style.display = 'inline-block';
    } catch (error) {
        handleFetchError(error, 'Error al cargar el libro:');
    }
}

// Actualizar libro
async function updateBook() {
    const fieldIds = ['book_id', 'title', 'author', 'genre', 'read_date'];
    if (!validateForm(fieldIds.slice(1))) {
        alert('Todos los campos son obligatorios. Por favor, completa el formulario.');
        return;
    }

    const bookId = document.getElementById('book_id').value;
    const bookData = Object.fromEntries(
        fieldIds.slice(1).map(id => [id, document.getElementById(id).value.trim()])
    );

    try {
        const response = await fetch(`${baseURL}/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData),
        });

        const result = await response.json();
        alert(result.message);
        getBooks();
        clearForm(fieldIds);
        document.getElementById('saveBookBtn').style.display = 'inline-block';
        document.getElementById('updateBookBtn').style.display = 'none';
    } catch (error) {
        handleFetchError(error, 'Error al actualizar el libro:');
    }
}

// Eliminar libro
async function deleteBook(bookId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) return;

    try {
        const response = await fetch(`${baseURL}/${bookId}`, { method: 'DELETE' });
        const result = await response.json();
        alert(result.message);
        getBooks();
    } catch (error) {
        handleFetchError(error, 'Error al eliminar el libro:');
    }
}

// Archivar libro
async function archiveBook(bookId) {
    try {
        const response = await fetch(`${baseURL}/${bookId}/archive`, { method: 'PUT' });
        const result = await response.json();
        alert(result.message);
        getBooks();
    } catch (error) {
        handleFetchError(error, 'Error al archivar el libro:');
    }
}

// =======================
// FUNCIONES PARA RESEÑAS
// =======================

// Renderizar reseñas en la tabla
function renderReviews(reviews) {
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = reviews.length
        ? reviews.map(review => `
            <tr>
                <td>${review.review_id}</td>
                <td>${review.book_id}</td>
                <td>${review.user_id}</td>
                <td>${review.rating}</td>
                <td>${review.review_text}</td>
                <td>${new Date(review.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editReview(${review.review_id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteReview(${review.review_id})">Eliminar</button>
                </td>
            </tr>
        `).join('')
        : '<tr><td colspan="7" class="text-center">No hay reseñas disponibles</td></tr>';
}

// Obtener todas las reseñas
async function getReviews() {
    try {
        const response = await fetch(reviewsURL);
        const reviews = await response.json();
        renderReviews(reviews);
    } catch (error) {
        handleFetchError(error, 'Error al obtener reseñas:');
    }
}

// Crear una nueva reseña
async function addReview() {
    const fieldIds = ['reviewBookId', 'reviewUserId', 'reviewRating', 'reviewText'];
    if (!validateForm(fieldIds)) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    const reviewData = Object.fromEntries(
        fieldIds.map(id => [id.replace('review', '').toLowerCase(), document.getElementById(id).value.trim()])
    );

    try {
        const response = await fetch(reviewsURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });

        const result = await response.json();
        alert(result.message || 'Reseña agregada exitosamente.');
        getReviews();
        clearForm(fieldIds);
    } catch (error) {
        handleFetchError(error, 'Error al agregar reseña:');
    }
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
    getBooks();
    getReviews();
    document.getElementById('saveBookBtn').addEventListener('click', saveBook);
    document.getElementById('updateBookBtn').addEventListener('click', updateBook);
});
