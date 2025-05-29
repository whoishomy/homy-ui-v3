import '@testing-library/cypress/add-commands';
import 'cypress-axe';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
    }
  }
}

// Custom command example
Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy="${value}"]`);
});

// Prevent uncaught exceptions from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
}); 