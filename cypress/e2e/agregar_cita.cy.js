describe('Agregar una cita', () => {
    beforeEach(() => {
      // Navegar a la página
      cy.visit('http://127.0.0.1:5500/frontend/html/quotes.html'); // Asegúrate de usar la ruta correcta
    });
  
    it('Debería agregar una nueva cita correctamente', () => {
      // Llenar el formulario
      cy.get('#writer').type('Gabriel García Márquez');
      cy.get('#quoteText').type('El secreto de una buena vejez no es otra cosa que un pacto honrado con la soledad.');
      
      // Enviar el formulario
      cy.get('#quoteForm').submit();
      
      // Verificar que la cita se agregó a la lista
      cy.get('#quoteList')
        .should('contain', 'Gabriel García Márquez')
        .and('contain', 'El secreto de una buena vejez no es otra cosa que un pacto honrado con la soledad.');
    });
  
    it('Debería limpiar los campos del formulario al presionar "Limpiar"', () => {
      // Llenar los campos del formulario
      cy.get('#writer').type('Jane Austen');
      cy.get('#quoteText').type('No quiero que la gente sea muy agradable, ya que me ahorra problemas de gustarles demasiado.');
  
      // Hacer clic en el botón Limpiar
      cy.contains('Limpiar').click();
  
      // Verificar que los campos están vacíos
      cy.get('#writer').should('have.value', '');
      cy.get('#quoteText').should('have.value', '');
    });
  
    it('Debería mostrar las citas existentes al presionar "Actualizar"', () => {
      // Hacer clic en el botón Actualizar
      cy.contains('Actualizar').click();
  
      // Verificar que las citas se muestran (ajusta según datos esperados)
      cy.get('#quoteList').should('not.be.empty');
    });
  });
  