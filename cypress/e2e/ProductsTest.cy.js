describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/SupplierDashboard/Products')

    cy.server();
    cy.route({
      method: 'GET',
      url: `${Cypress.env('VITE_API_URL')}product/catalog-product`,
      response: 'fixture:catalog-products.json' // Assuming you have a fixture file named catalog-products.json with sample data
    }).as('getCatalogProducts');

    cy.get('[data-testid="cypress-Product-table"]').should('exist');

    cy.wait('@getCatalogProducts').then(xhr => {
      // Assert that the table has correct number of rows
      cy.get('[data-testid="cypress-Product-table"] tbody tr').should('have.length', xhr.response.body.length);

      // Assert that each row contains the expected data
      xhr.response.body.forEach(product => {
        cy.get(`[data-testid="cypress-Product-table"] tbody tr:contains("${product.product_name}")`).should('exist');
        cy.get(`[data-testid="cypress-Product-table"] tbody tr:contains("${product.brand}")`).should('exist');
        // Add assertions for other fields as needed
      });
    });
  })
})
