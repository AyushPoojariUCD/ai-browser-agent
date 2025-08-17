/* eslint-env cypress */

describe("Signup Flow", () => {
  const email = `user_${Date.now()}@example.com`;
  const password = "securePassword123";

  it("renders signup page", () => {
    cy.visit("/signup");
    cy.contains("Create an Account").should("be.visible");
    cy.get("input[type='email']").should("exist");
    cy.get("input[type='password']").should("exist");
  });

  it("signs up and redirects to chat", () => {
    cy.visit("/signup");
    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/chat");
  });
});