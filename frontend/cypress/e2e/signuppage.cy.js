/* eslint-env cypress */

describe("Signup Page", () => {
  const today = new Date();
  const dateString = `${today.getFullYear()}${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}`;
  const uniqueEmail = `user_${dateString}_${Date.now()}@example.com`;
  const password = "securePassword123";

  beforeEach(() => {
    cy.visit("/signup");
  });

  it("renders signup page correctly", () => {
    cy.contains("Create an Account").should("be.visible");
    cy.get("input[type='email']").should("exist");
    cy.get("input[type='password']").should("exist");
    cy.get("button[type='submit']").should("contain", "Sign Up");
    cy.contains("Already have an account?").should("be.visible");
    cy.get('a[href="/login"]').should("contain", "Sign In");
    cy.contains('a', "Back to Home").should("exist");
  });

  it("navigates to login page on Sign In link click", () => {
    cy.get('a[href="/login"]').click();
    cy.url().should("include", "/login");
  });

  it("signs up a new user with unique email and password", () => {
    cy.get("input[type='email']").type(uniqueEmail);
    cy.get("input[type='password']").type(password);
    cy.get("button[type='submit']").click();

    // After successful signup, app might redirect to /chat or /login
    // Adjust assertions to match your app's behavior
    cy.url({ timeout: 15000 }).should((url) => {
      expect(url).to.match(/\/chat|\/login/);
    });

    // Optional: Check if some element confirming signup exists
    // Example: cy.contains("Welcome").should("exist");
  });
});
