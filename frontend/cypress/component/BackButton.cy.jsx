/// <reference types="cypress" />
import React from "react";
import { MemoryRouter } from "react-router-dom";
import BackButton from "../../src/components/BackButton";

describe("BackButton Component", () => {
  it("renders with default props", () => {
    cy.mount(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );

    cy.contains("Back to Home").should("exist");
    cy.get("a").should("have.attr", "href", "/");
  });

  it("renders with custom label and link", () => {
    cy.mount(
      <MemoryRouter>
        <BackButton to="/dashboard" label="Go to Dashboard" />
      </MemoryRouter>
    );

    cy.contains("Go to Dashboard").should("exist");
    cy.get("a").should("have.attr", "href", "/dashboard");
  });

  it("has proper styling classes", () => {
    cy.mount(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>
    );

    cy.get("a").should("have.class", "bg-gray-600").and("have.class", "hover:bg-gray-700");
  });
});
