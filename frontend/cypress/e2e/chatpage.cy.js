/* eslint-env cypress */

describe("Chat Page", () => {
  const email = "existing_user@example.com"; // Replace with valid test account
  const password = "securePassword123";

  before(() => {
    // Log in before running tests
    cy.visit("/login");
    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();
    cy.url({ timeout: 15000 }).should("include", "/chat");
  });

  beforeEach(() => {
    cy.visit("/chat");
  });

  it("displays message input and list after creating a chat", () => {
    cy.contains("New Chat").click();
    cy.get("input[placeholder*='Type your message']")
      .should("exist")
      .and("not.be.disabled");
    cy.get("button").contains(/Send|Run/).should("exist");
  });

  it("sends a message and displays it in the message list", () => {
    const testMessage = "Hello, Cypress!";
    cy.contains("New Chat").click();
    cy.get("input[placeholder*='Type your message']").type(testMessage);
    cy.get("button").contains(/Send|Run/).click();
    cy.contains(testMessage, { timeout: 10000 }).should("exist");
  });
});
