describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('xx', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:5173/');
    cy.get('.mt-4 > :nth-child(2) > .px-6 > :nth-child(3)').click();
    cy.get('.bg-transparent').click();
    /* ==== End Cypress Studio ==== */
  });
})