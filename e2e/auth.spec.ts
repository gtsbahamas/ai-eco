import { test, expect } from '@playwright/test';

test.describe('End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the application
    await page.goto('http://localhost:3000');
  });

  test('login page loads correctly', async ({ page }) => {
    // Verify login page elements
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByText('Sign in with Google')).toBeVisible();
  });

  test('login with valid credentials redirects to dashboard', async ({ page }) => {
    // Fill in login form
    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // Click sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText('AI Agency Ecosystem Dashboard')).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    // Fill in login form with invalid credentials
    await page.getByLabel('Email address').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Click sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Verify error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('registration form works correctly', async ({ page }) => {
    // Navigate to registration page
    await page.getByText('Create an account').click();
    
    // Verify registration page
    await expect(page.getByText('Sign up for AI Agency Ecosystem')).toBeVisible();
    
    // Fill in registration form
    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email address').fill('newuser@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByLabel('Confirm Password').fill('password123');
    
    // Submit form
    await page.getByRole('button', { name: 'Sign up' }).click();
    
    // Verify redirect to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Account created successfully')).toBeVisible();
  });

  test('authenticated user can access dashboard', async ({ page }) => {
    // Login first
    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Verify dashboard access
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check dashboard components
    await expect(page.getByText('Clients')).toBeVisible();
    await expect(page.getByText('Projects')).toBeVisible();
    await expect(page.getByText('Tasks')).toBeVisible();
    await expect(page.getByText('Resources')).toBeVisible();
  });

  test('admin user can access admin dashboard', async ({ page }) => {
    // Login as admin
    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Navigate to admin dashboard
    await page.getByText('Admin').click();
    
    // Verify admin dashboard access
    await expect(page.getByText('Admin Dashboard')).toBeVisible();
    await expect(page.getByText('User Management')).toBeVisible();
    await expect(page.getByText('System Settings')).toBeVisible();
  });

  test('regular user cannot access admin dashboard', async ({ page }) => {
    // Login as regular user
    await page.getByLabel('Email address').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Try to navigate to admin dashboard
    await page.goto('http://localhost:3000/admin');
    
    // Verify unauthorized access
    await expect(page.getByText('Unauthorized')).toBeVisible();
    await expect(page.getByText('You do not have permission to access this page')).toBeVisible();
  });

  test('client management functionality', async ({ page }) => {
    // Login first
    await page.getByLabel('Email address').fill('manager@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Navigate to clients page
    await page.getByText('Manage Clients').click();
    
    // Verify clients page
    await expect(page.getByText('Client Management')).toBeVisible();
    
    // Add new client
    await page.getByText('Add New Client').click();
    await page.getByLabel('Client Name').fill('E2E Test Client');
    await page.getByLabel('Contact Email').fill('e2e@testclient.com');
    await page.getByLabel('Contact Phone').fill('555-E2E-TEST');
    await page.getByRole('button', { name: 'Add Client' }).click();
    
    // Verify new client appears in list
    await expect(page.getByText('E2E Test Client')).toBeVisible();
    await expect(page.getByText('e2e@testclient.com')).toBeVisible();
  });

  test('project management functionality', async ({ page }) => {
    // Login first
    await page.getByLabel('Email address').fill('manager@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Navigate to projects page
    await page.getByText('Track Projects').click();
    
    // Verify projects page
    await expect(page.getByText('Project Tracking')).toBeVisible();
    
    // Add new project
    await page.getByText('Add New Project').click();
    await page.getByLabel('Client').selectOption({ label: 'Acme Corporation' });
    await page.getByLabel('Project Name').fill('E2E Test Project');
    await page.getByLabel('Description').fill('Project created during E2E testing');
    await page.getByLabel('Start Date').fill('2025-04-01');
    await page.getByRole('button', { name: 'Add Project' }).click();
    
    // Verify new project appears in list
    await expect(page.getByText('E2E Test Project')).toBeVisible();
    await expect(page.getByText('Project created during E2E testing')).toBeVisible();
  });

  test('logout functionality', async ({ page }) => {
    // Login first
    await page.getByLabel('Email address').fill('admin@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Logout
    await page.getByText('Logout').click();
    
    // Verify redirect to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByText('Sign in to your account')).toBeVisible();
  });
});
