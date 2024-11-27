// Función para agregar una cita
function addQuote() {
    const quoteText = document.getElementById('quoteText').value;
    const writer = document.getElementById('writer').value;

    fetch('http://localhost:3001/api/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quote_text: quoteText,
            writer: writer
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Cita añadida:', data);
            clearQuoteForm();
            getQuotes();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Función para obtener todas las citas
function getQuotes() {
    fetch('http://localhost:3001/api/quotes')
        .then(response => response.json())
        .then(data => {
            const quoteList = document.getElementById('quoteList');
            quoteList.innerHTML = '';
            data.forEach(quote => {
                const row = `<tr>
                                <td>${quote.quote_id}</td>
                                <td>${quote.quote_text}</td>
                                <td>${quote.writer}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" onclick="openEditModal('${quote.quote_id}', '${quote.quote_text}', '${quote.writer}')">Editar</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteQuote('${quote.quote_id}')">Eliminar</button>
                                </td>
                            </tr>`;
                quoteList.innerHTML += row;
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Función para limpiar el formulario
function clearQuoteForm() {
    document.getElementById('quoteForm').reset();
}

// Función para eliminar una cita
function deleteQuote(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
        fetch(`http://localhost:3001/api/quotes/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert('Cita eliminada');
                    getQuotes(); // Actualiza la lista
                } else {
                    alert('Error al eliminar la cita');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

// Abre el modal para editar la cita
function openEditModal(id, text, writer) {
    document.getElementById('editQuoteText').value = text;
    document.getElementById('editWriter').value = writer;
    document.getElementById('quoteIdToEdit').value = id; // Guarda el ID para la edición
    $('#editQuoteModal').modal('show'); // Mostrar el modal
}

// Guarda los cambios de la cita editada
function saveEditQuote() {
    const quoteId = document.getElementById('quoteIdToEdit').value;
    const updatedQuoteText = document.getElementById('editQuoteText').value;
    const updatedWriter = document.getElementById('editWriter').value;

    fetch(`http://localhost:3001/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quote_text: updatedQuoteText,
            writer: updatedWriter
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Cita actualizada:', data);
            $('#editQuoteModal').modal('hide'); // Esconde el modal
            getQuotes(); // Actualiza la lista
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Cargar las citas al cargar la página
window.onload = getQuotes;
