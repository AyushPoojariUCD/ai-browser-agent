// cypress/support/component.js
/// <reference types="cypress" />
// Import custom commands
import './commands'

// Import the mount function from Cypress React
import { mount } from 'cypress/react'

// Register mount as a custom command
Cypress.Commands.add('mount', mount)
