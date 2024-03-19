describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/SupplierDashboard/Products')

    cy.get('[data-testid="cypress-title"]').should('exist')
      .should('have.text', 'Products');

    cy.get('[data-testid="cypress-Product-table"]').should('exist');

    
  })
})
