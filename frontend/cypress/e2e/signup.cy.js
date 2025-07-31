/* eslint-env cypress */

describe("Signup Flow", () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
  const email = `user_${dateString}_${Date.now()}@example.com`;
  const password = "securePassword123";

  beforeEach(() => {
    cy.visit("/signup"); // Adjust if your route is different
  });

  it("should render the signup page correctly", () => {
    cy.contains("Create an Account").should("be.visible");
    cy.get("input[type='email']").should("exist");
    cy.get("input[type='password']").should("exist");
    cy.get("button[type='submit']").should("contain", "Sign Up with Email");
  });

  it("should signup a new user with email and password", () => {
    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();
  });
});
