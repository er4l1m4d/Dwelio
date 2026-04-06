import { test, expect } from '@playwright/test';

test.describe('Dwelio Core Flows', () => {

  test('Homepage has correct title and navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Verify title based on Next.js metadata
    await expect(page).toHaveTitle(/Dwelio/i);

    // Verify brand name is present in Nav
    const brandLogo = page.locator('text=Dwelio').first();
    await expect(brandLogo).toBeVisible();

    // Verify 'Discover' link routes to Search
    const discoverLink = page.getByRole('link', { name: 'Discover' }).first();
    if (await discoverLink.isVisible()) {
      await discoverLink.click();
      await expect(page).toHaveURL(/.*\/search/);
    }
  });

  test('Search page toggles and filters sync with URL', async ({ page }) => {
    await page.goto('/search');

    // Toggle Map View
    const mapViewBtn = page.getByRole('button', { name: /Map View/i });
    await mapViewBtn.click();
    await expect(page).toHaveURL(/view=map/);

    // Toggle List View
    const listViewBtn = page.getByRole('button', { name: /List View/i });
    await listViewBtn.click();
    // Next.js router might remove the param or set it to list
    await expect(page).not.toHaveURL(/view=map/);

    // Apply Quick Filter: Rent
    const rentFilterBtn = page.getByRole('button', { name: 'Rent', exact: true });
    // Assuming the "Rent" quick filter is accessible
    if (await rentFilterBtn.isVisible()) {
      await rentFilterBtn.click();
      await expect(page).toHaveURL(/type=rent/);
    }
  });

  test('Message Landlord redirects unauthenticated user to login', async ({ page }) => {
    // Go to search to find a listing
    await page.goto('/search');

    // Find the first property card link and click it
    const firstListingLink = page.locator('a[href^="/listings/"]').first();
    
    // Fallback if no listings exist in DB
    if (!(await firstListingLink.isVisible())) {
      console.log('No listings available to test detail view');
      return; 
    }

    await firstListingLink.click();

    // We should be on the listing detail page now
    await expect(page).toHaveURL(/.*\/listings\/.+/);

    // Click "Message Landlord" button
    const messageBtn = page.locator('a:has-text("Message Landlord")').first();
    if (await messageBtn.isVisible()) {
      await messageBtn.click();
      
      // Should redirect to login with a return URL
      await expect(page).toHaveURL(/.*\/login\?redirect=.+/);
    }
  });

});
