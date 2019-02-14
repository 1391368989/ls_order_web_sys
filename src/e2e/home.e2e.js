import puppeteer from 'puppeteer';
import {localhost} from '../utils/utils.js'
describe('Homepage', () => {
  it('it should have logo text', async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(localhost, { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain('<h1>订单管理系统</h1>');
    await page.close();
    browser.close();
  });
});
