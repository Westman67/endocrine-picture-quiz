import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { chromium } from 'playwright';

async function getLocalURL(server) {
    const timer = AbortSignal.timeout(6000);
    const [buffer] = await once(server.stdout, 'data', { signal: timer });
    const url = buffer.toString().match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];
    assert(url, 'The quiz server must report its loopback URL');
    return url;
}

async function checkChoices(page) {
    await page.locator('#feedback .rationale').last().waitFor();
    const choices = await page.locator('#feedback .rationale .rationale-status').allTextContents();
    assert.equal(choices.filter(label => label.startsWith('Correct')).length, 1);
    assert.equal(choices.filter(label => label.endsWith('Your choice')).length, 1);
    assert.equal(choices.length, await page.locator('button.choice').count());
}

const root = path.resolve(import.meta.dirname, '..');
const server = process.env.QUIZ_URL ? null : spawn('python3', ['scripts/serve.py', '--port', '0'], { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] });
let browser;
try {
    const base = process.env.QUIZ_URL || await getLocalURL(server);
    browser = await chromium.launch();
    for (const bank of ['physiology', 'combined']) {
        const page = await browser.newPage({ serviceWorkers: 'block', viewport: { width: bank === 'physiology' ? 390 : 1280, height: 840 } });
        page.setDefaultTimeout(12000);
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => { window.confirm = () => true; });
        await page.goto(new URL(`?bank=${bank}`, base).href);
        await page.locator('#start').waitFor();
        await page.locator('#start').click();
        assert.equal(await page.locator('#original,#feedback').count(), 0);
        await page.locator('button.choice').first().click();
        await page.locator('#submit').click();
        if (bank === 'physiology') await checkChoices(page);
        await page.locator('#finish').click();
        assert.deepEqual(errors, []);
        console.log(`OK ${bank}: started, answered, and finished without errors`);
        await page.close();
    }
} finally {
    await browser?.close();
    server?.kill();
}
