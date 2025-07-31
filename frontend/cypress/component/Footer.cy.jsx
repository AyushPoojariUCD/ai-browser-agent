import Footer from '../../src/components/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    cy.mount(<Footer />);
  });

  it('renders all section headers', () => {
    cy.contains('Popular integrations').should('exist');
    cy.contains('Trending combinations').should('exist');
    cy.contains('Integration Categories').should('exist');
    cy.contains('Top Guides').should('exist');
  });

  it('displays some integration items', () => {
    cy.contains('Google Sheets');
    cy.contains('Twilio and WhatsApp');
    cy.contains('Cybersecurity');
    cy.contains('Open-source LLM');
  });

  it('renders bottom copyright text', () => {
    cy.contains('© 2025 AI-Browser-Agent. All rights reserved.').should('exist');
  });

  it('renders bottom links', () => {
    cy.contains('Impressum').should('have.attr', 'href', '#');
    cy.contains('Legal').should('have.attr', 'href', '#');
    cy.contains('Privacy').should('have.attr', 'href', '#');
    cy.contains('Report a vulnerability').should('have.attr', 'href', '#');
  });
});
