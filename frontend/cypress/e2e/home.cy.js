/* eslint-env cypress */

describe("Home Page", () => {
  it("renders hero section and can go to signup", () => {
    cy.visit("/");
    cy.contains("AI-Browser-Agent").should("exist");
    cy.url().should("include", "/signup");
  });
});
