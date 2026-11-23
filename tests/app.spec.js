import { test, expect } from '@playwright/test';

/* Fails the test on any uncaught error or console error. */
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  return errors;
}
async function login(page, label) {
  await page.goto('/');
  await page.getByRole('button', { name: new RegExp(label) }).click();
}

test.beforeEach(async ({ page }) => {
  // The first-time tour is covered by its own test; keep it out of the others.
  await page.addInitScript(() => localStorage.setItem('kid-tour', JSON.stringify(['web', 'setup', 'phone'])));
  // Fresh data for every test.
  await page.goto('/');
  await page.evaluate(() => new Promise(r => { const q = indexedDB.deleteDatabase('keyval-store'); q.onsuccess = q.onerror = q.onblocked = () => r(); }));
  await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
});

test('admin can open every page without errors', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Admin');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  for (const v of ['households', 'verify', 'cards', 'centers', 'inventory', 'distributions', 'reports', 'devices', 'users', 'audit', 'config', 'system', 'import', 'walkin', 'dashboard']) {
    await page.evaluate(h => { location.hash = h; }, v);
    await expect(page.locator('.view h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('first-time tour: skip, stays skipped, replay from help', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('kid-tour'));
  await page.getByRole('button', { name: /Admin/ }).click();
  const card = page.locator('.tour-card');
  await expect(card).toContainText('Welcome, Ramon');
  await page.getByRole('button', { name: 'Start tour' }).click();
  await expect(card).toContainText('Step 2 of');
  await page.keyboard.press('ArrowRight');
  await expect(card).toContainText('Step 3 of');
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(card).toContainText('Step 2 of');
  await page.getByRole('button', { name: 'Skip tour' }).click();
  await expect(page.locator('#tour')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('kid-tour')))).toContain('web');
  // replay from the ? button, then finish it
  await page.getByRole('button', { name: /Help: replay the tour/ }).click();
  await expect(card).toContainText('Step 1 of');
  await page.keyboard.press('Escape');
  await expect(page.locator('#tour')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('dashboard tabs, notifications and theme', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Admin');
  await page.getByRole('tab', { name: /Relief stock/ }).click();
  await expect(page.getByText('Hygiene kit').first()).toBeVisible();
  await page.getByRole('tab', { name: /Distribution/ }).click();
  await expect(page.getByText('Device sync')).toBeVisible();
  await page.getByRole('button', { name: /Notifications/ }).click();
  await expect(page.getByText('Needs attention', { exact: true })).toBeVisible();
  await page.mouse.click(5, 400);
  await expect(page.getByText('Needs attention', { exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('button', { name: 'Dark' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

test('household search, drawer tabs and edit persist after reload', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Admin');
  await page.goto('/#households');
  await page.locator('#hh-q').fill('Maria Santos');
  const row = page.locator('tr.click', { hasText: 'ALB-0123-004512' });
  await expect(row).toBeVisible();
  await row.click();
  const drawer = page.locator('.drawer');
  await expect(drawer.getByText('ALB-0123-004512')).toBeVisible();
  for (const tab of ['Members', 'Card', 'Activity', 'Overview']) {
    await drawer.getByRole('tab', { name: new RegExp(tab) }).click();
    await expect(drawer.getByRole('tab', { name: new RegExp(tab) })).toHaveAttribute('aria-selected', 'true');
  }
  await drawer.getByRole('button', { name: /^Edit$/ }).click();
  await page.locator('#e-ph').fill('0917 000 9999');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Household updated.')).toBeVisible();
  await page.waitForTimeout(500); // batched save
  await page.reload();
  await page.locator('#hh-q').fill('004512');
  await page.locator('tr.click', { hasText: 'ALB-0123-004512' }).click();
  await expect(page.locator('.drawer').getByText('0917 000 9999')).toBeVisible();
  expect(errors).toEqual([]);
});

test('command palette finds a household and a page', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Admin');
  await page.keyboard.press('Control+k');
  await expect(page.locator('#cmdk-q')).toBeFocused();
  await page.keyboard.type('santos');
  await expect(page.locator('.cmdk-item').first()).toBeVisible();
  await page.locator('#cmdk-q').fill('004512');
  await page.keyboard.press('Enter');
  await expect(page.locator('.drawer').getByText('ALB-0123-004512')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Control+k');
  await page.locator('#cmdk-q').fill('inventory');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#inventory/);
  await page.getByRole('tab', { name: /Stock movements/ }).click();
  await expect(page.getByText('DSWD Region V (sample)').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('settings tabs keep all fields and save', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Admin');
  await page.goto('/#config');
  await page.locator('#st-mun').fill('Daraga City');
  await page.getByRole('tab', { name: 'Relief and alerts' }).click();
  await page.locator('#st-cat').fill('<img src=x onerror=alert(1)>');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.locator('.chip', { hasText: '<img' })).toBeVisible(); // shown as text, not HTML
  await page.getByRole('button', { name: /Remove <img/ }).click();
  await expect(page.locator('.chip', { hasText: '<img' })).toHaveCount(0);
  // the unsaved edit on the other tab survived the category changes
  await page.getByRole('tab', { name: 'Municipality' }).click();
  await expect(page.locator('#st-mun')).toHaveValue('Daraga City');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Settings saved.')).toBeVisible();
  await expect(page.locator('.brand small')).toContainText('Daraga City');
  expect(errors).toEqual([]);
});

test('walk-in registration issues a card and appears in the queue', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Encoder');
  await page.goto('/#walkin');
  await page.locator('#wm-n0').fill('Test Walkin Person');
  await page.locator('#wm-b0').fill('1980-02-03');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('#wk-loc').fill('Covered court, Purok 1');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('#wk-c').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: /Save and issue card/ }).click();
  await expect(page.getByText('Card issued to Test Walkin Person')).toBeVisible();
  await page.goto('/#verify');
  await expect(page.getByText('Test Walkin Person')).toBeVisible();
  expect(errors).toEqual([]);
});

test('import the sample file', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Admin');
  await page.goto('/#import');
  await page.getByRole('button', { name: /Use the sample file/ }).click();
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Confirm import' }).click();
  await expect(page.getByText('Import finished')).toBeVisible();
  expect(errors).toEqual([]);
});

test('officer cannot open admin pages', async ({ page }) => {
  await login(page, 'Officer');
  await page.goto('/#users');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.locator('.nav a[href="#users"]')).toHaveCount(0);
});

test('scanner: relief, double claim, offline queue and sync @phone', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Scanner Volunteer');
  await page.getByRole('button', { name: /Download records and start/ }).click();
  await expect(page.getByRole('button', { name: /Scan Card/ })).toBeVisible();
  // go offline
  await page.getByRole('button', { name: /Connection status/ }).click();
  await page.getByRole('button', { name: /Scan Card/ }).click();
  await page.getByRole('button', { name: /Maria Santos/ }).click();
  await expect(page.getByText('Not yet received')).toBeVisible();
  await page.getByRole('button', { name: 'Record received' }).click();
  await expect(page.locator('#ph-body').getByText('Recorded. Saved on this phone.')).toBeVisible();
  // same card again shows Already received
  await page.getByRole('button', { name: /Scan next card/ }).click();
  await page.getByRole('button', { name: /Maria Santos/ }).click();
  await expect(page.getByText('Already received')).toBeVisible();
  // lost card is rejected
  await page.getByRole('button', { name: /Scan next card/ }).click();
  await page.getByRole('button', { name: /Lost card/ }).click();
  await expect(page.getByText('This card was deactivated')).toBeVisible();
  // back online -> queue uploads
  await page.getByRole('button', { name: /Connection status/ }).click();
  await expect(page.getByText(/Uploaded \d+ record/)).toBeVisible();
  expect(errors).toEqual([]);
});

test('works offline after first visit (service worker)', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('button', { name: /Admin/ })).toBeVisible();
  await context.setOffline(false);
});

test('every dialog opens and closes for admin', async ({ page }) => {
  const errors = watchErrors(page);
  await login(page, 'Admin');
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  const hid = await page.evaluate(() => DB.households.find(h => h.status === 'pending').id);
  const dialogs = [['edit-hh', { id: hid }], ['reissue', { id: hid }], ['deactivate', { id: hid }], ['archive', { id: hid }], ['info', { id: hid }], ['reject', { id: hid }], ['merge', { id: hid, q: 'san' }],
    ['center', {}], ['item', {}], ['stock', { type: 'IN' }], ['stock', { type: 'OUT' }], ['round', {}], ['user', {}], ['user', { id: 'u2' }], ['revoke', { id: 'SCN-02' }], ['reset', {}]];
  for (const [kind, data] of dialogs) {
    await page.evaluate(([k, d]) => A.modal(k, d), [kind, data]);
    await expect(page.locator('.modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.modal')).toHaveCount(0);
  }
  for (const kind of ['center', 'round']) {
    const id = await page.evaluate(k => (k === 'center' ? DB.centers[0] : DB.rounds[0]).id, kind);
    await page.evaluate(([k, i]) => A.drawer(k, i), [kind, id]);
    for (const tab of await page.locator('.drawer [role=tab]').all()) await tab.click();
    await page.keyboard.press('Escape');
  }
  expect(errors).toEqual([]);
});

for (const role of ['Encoder', 'Officer']) {
  test(`${role} can open each allowed page without errors`, async ({ page }) => {
    const errors = watchErrors(page);
    await login(page, role);
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor();
    const links = await page.locator('.nav a').evaluateAll(as => as.map(a => a.getAttribute('href')));
    for (const href of links) { await page.evaluate(h => { location.hash = h; }, href); await expect(page.locator('.view h1')).toBeVisible(); }
    expect(errors).toEqual([]);
  });
}

test('scanner: sound switch, feedback per result, unsent-data guard @phone', async ({ page }) => {
  const errors = watchErrors(page);
  await page.addInitScript(() => {
    window.__fb = [];
    navigator.vibrate = p => { window.__fb.push(JSON.stringify(p)); return true; };
  });
  await login(page, 'Scanner Volunteer');
  await page.getByRole('button', { name: /Download records and start/ }).click();
  const off = page.getByRole('group', { name: 'Scan sounds' }).getByRole('button', { name: 'Off' });
  await off.click();
  await expect(off).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('kid-sound'))).toBe('off');
  // each result buzzes differently
  await page.getByRole('button', { name: /Connection status/ }).click();
  await page.getByRole('button', { name: /Scan Card/ }).click();
  await page.getByRole('button', { name: /Maria Santos/ }).click();
  await page.getByRole('button', { name: 'Record received' }).click();
  await page.getByRole('button', { name: /Scan next card/ }).click();
  await page.getByRole('button', { name: /Maria Santos/ }).click();
  await expect(page.getByText('Already received')).toBeVisible();
  expect(await page.evaluate(() => window.__fb)).toEqual(['[60]', '[40,60,40]', '[200,100,200]']);
  // an unsent record makes the page ask before closing
  const asked = await page.evaluate(() => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented; });
  expect(asked).toBe(true);
  expect(errors).toEqual([]);
});
