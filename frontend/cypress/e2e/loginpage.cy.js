/* eslint-env cypress */

describe("Login Page", () => {
  const email = "existing_user@example.com"; // Use a valid test user in your dev/test env
  const password = "securePassword123";

  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders login page correctly", () => {
    cy.contains("Welcome Back").should("be.visible");
    cy.get("input[type='email']").should("exist");
    cy.get("input[type='password']").should("exist");
    cy.get("button[type='submit']").should("contain", "Login with Email");
    cy.contains("Don’t have an account?").should("be.visible");
    cy.get('a[href="/signup"]').should("contain", "Sign Up");
    cy.contains('a', "Back to Home").should("exist");
  });

  it("navigates to signup page on Sign Up link click", () => {
    cy.get('a[href="/signup"]').click();
    cy.url().should("include", "/signup");
  });

  it("logs in successfully with valid credentials", () => {
    cy.get("input[type='email']").type(email);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();

    // Adjust timeout depending on backend speed
    cy.url({ timeout: 15000 }).should("include", "/chat");
    cy.contains("Logout", { timeout: 15000 }).should("be.visible");
  });
});
