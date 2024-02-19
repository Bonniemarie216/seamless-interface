describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('x', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:5173/');
    cy.get(':nth-child(2) > .px-6 > :nth-child(5) > .text-main16').click();
    cy.get('.bg-transparent').click();
    cy.get('.hover\\:bg-primary-dark').click();
    cy.get('.justify-between.items-center > .bg-white').clear('1');
    cy.get('.justify-between.items-center > .bg-white').type('0.1');
    cy.get('.gap-4 > .hover\\:bg-primary-dark').click();
    cy.get('.gap-4 > .hover\\:bg-primary-dark').click();
    cy.get('.gap-4 > .hover\\:bg-primary-dark').click();
    cy.get('.gap-4 > .hover\\:bg-primary-dark').click();
    cy.get('.gap-4 > .hover\\:bg-primary-dark').click();
    cy.get('.gap-4 > .hover\\:bg-primary-dark').click();
    cy.get('.hover\\:bg-action-focus > img').click();
    /* ==== End Cypress Studio ==== */
  });
})