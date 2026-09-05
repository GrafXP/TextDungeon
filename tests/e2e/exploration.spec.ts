import { expect, test } from '@playwright/test'

test('startet, erkundet, lädt neu und zeigt dieselben Kartendaten', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Wie heisst du?').fill('Mira')
  await page.getByRole('button', { name: 'Abenteuer starten' }).click()

  await expect(page.getByRole('heading', { name: 'Sonnenwacht' })).toBeVisible()
  await page.getByRole('button', { name: /Gehe zum Alten Markt/ }).click()
  await page.getByRole('button', { name: /Nimm die Hebelstange/ }).click()
  await expect(page.getByRole('listitem').filter({ hasText: 'Hebelstange' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Alter Markt' })).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: 'Hebelstange' })).toBeVisible()

  await page.getByRole('link', { name: 'Karte' }).click()
  await expect(page.getByRole('heading', { name: 'Entdeckte Orte und Wege' })).toBeVisible()
  await expect(page.getByText('Alter Markt', { exact: true }).last()).toBeVisible()
})

test('enthält keine Vorlesefunktion mehr', async ({ page }) => {
  await page.goto('/einstellungen')
  await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible()
  await expect(page.getByText(/vorlesen/i)).toHaveCount(0)
})

test('findet den Hafenspeer, zeigt seine Werte und rüstet ihn aus', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Wie heisst du?').fill('Nia')
  await page.getByRole('button', { name: 'Abenteuer starten' }).click()

  await page.getByRole('button', { name: /Gehe zum Alten Markt/ }).click()
  await page.getByRole('button', { name: /Nimm die Hebelstange/ }).click()
  await page.getByRole('button', { name: /Gehe nach Sonnenwacht/ }).click()
  await page.getByRole('button', { name: /Gehe zum Drei-Wege-Platz/ }).click()
  await page.getByRole('button', { name: /Folge dem Weg zur Küste/ }).click()
  await page.getByRole('button', { name: /Gehe zum Muschelhafen/ }).click()
  await page.getByRole('button', { name: /Gehe zum überfluteten Markt/ }).click()
  await page.getByRole('button', { name: /Heble den Marktstand hoch/ }).click()
  await page.getByRole('button', { name: /Kehre zum Muschelhafen zurück/ }).click()
  await page.getByRole('button', { name: /Öffne Nelas Hafentruhe/ }).click()

  await page.getByRole('button', { name: 'Inventar' }).click()
  await page.getByRole('button', { name: /Hafenspeer/ }).click()
  await expect(page.getByRole('heading', { name: 'Hafenspeer' })).toBeVisible()
  await expect(page.getByText('3–5')).toBeVisible()
  await expect(page.getByText('Bonus gegen Wassergegner')).toBeVisible()
  await page.getByRole('button', { name: 'Ausrüsten' }).click()
  await expect(page.getByRole('button', { name: 'Ausgerüstet' })).toBeVisible()
  await page.getByRole('button', { name: 'Inventar schliessen' }).click()

  await expect(page.locator('.quick-status')).toContainText('Hafenspeer')
  await page.reload()
  await expect(page.locator('.quick-status')).toContainText('Hafenspeer')
})
