import { test, expect } from '@playwright/test';

test.describe('Emergency Report Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should display input screen on load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ResQBridge/i })).toBeVisible();
    await expect(page.getByLabelText(/emergency description/i)).toBeVisible();
  });

  test('should submit emergency report and show results', async ({ page }) => {
    const textarea = page.getByLabelText(/emergency description/i);
    await textarea.fill('Multi-vehicle collision on NH-48 near Nelamangala');

    const submitBtn = page.getByRole('button', { name: /report emergency/i });
    await submitBtn.click();

    // Wait for loading state
    await expect(page.getByText(/analysing/i)).toBeVisible();

    // Wait for results (with timeout for API call)
    await expect(page.getByText(/incident summary/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/dispatch details/i)).toBeVisible();
  });

  test('should handle photo upload', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    
    // Create a test image file
    await fileInput.setInputFiles({
      name: 'test-scene.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data'),
    });

    await expect(page.getByText(/test-scene.jpg/i)).toBeVisible();
  });

  test('should validate empty transcript', async ({ page }) => {
    const textarea = page.getByLabelText(/emergency description/i);
    await textarea.clear();

    const submitBtn = page.getByRole('button', { name: /report emergency/i });
    await expect(submitBtn).toBeDisabled();
  });

  test('should show character count', async ({ page }) => {
    const textarea = page.getByLabelText(/emergency description/i);
    await textarea.fill('Test');

    await expect(page.getByText(/4\/1000/)).toBeVisible();
  });

  test('should navigate back from results', async ({ page }) => {
    const textarea = page.getByLabelText(/emergency description/i);
    await textarea.fill('Emergency situation');

    await page.getByRole('button', { name: /report emergency/i }).click();
    await expect(page.getByText(/incident summary/i)).toBeVisible({ timeout: 10000 });

    const resetBtn = page.getByRole('button', { name: /report another emergency/i });
    await resetBtn.click();

    await expect(page.getByLabelText(/emergency description/i)).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Textarea
    
    const textarea = page.getByLabelText(/emergency description/i);
    await expect(textarea).toBeFocused();

    await textarea.fill('Emergency');
    await page.keyboard.press('Tab'); // Photo button
    await page.keyboard.press('Tab'); // Submit button
    
    const submitBtn = page.getByRole('button', { name: /report emergency/i });
    await expect(submitBtn).toBeFocused();
  });
});
