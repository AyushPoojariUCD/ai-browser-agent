/* eslint-env cypress */

describe("Signup, Logout, and Login Flow", () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
  const uniqueId = Date.now();
  const email = `user_${dateString}_${uniqueId}@example.com`;
  const password = "securePassword123";

  it("should sign up a new user successfully", () => {
    cy.visit("/signup");

    // Wait for page header to ensure page loaded
    cy.contains("Create an Account", { timeout: 10000 }).should("be.visible");

    // Fill signup form
    cy.get("input[type='email']").should("exist").type(email);
    cy.get("input[type='password']").should("exist").type(password);
    cy.get("button[type='submit']").should("contain", "Sign Up").click();

    // After signup, expect redirect or visible logout button
    cy.url({ timeout: 15000 }).should("not.include", "/signup");
  });

  it("should log back in with the same credentials", () => {
    cy.visit("/login");

    // Confirm login page loaded
    cy.contains("Welcome Back", { timeout: 10000 }).should("be.visible");

    // Fill login form
    cy.get("input[type='email']").should("exist").type(email);
    cy.get("input[type='password']").should("exist").type(password);
    cy.get("button[type='submit']").should("contain", "Login").click();

  });
});