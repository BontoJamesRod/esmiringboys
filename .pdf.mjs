import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'msedge' }); const p = await b.newPage();
await p.goto('file:///C:/Users/HP/AppData/Local/Temp/claude/6a046650d8471e6a/7e379232-3ee8-4a69-b867-24302c44931a/scratchpad/deck/guide.html'); await p.pdf({ path: 'C:/Users/HP/Downloads/Kaligtasan-ID-Team-Pack/1 - Team Guide (read this first).pdf', format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8px;color:#5F6B7A;width:100%;text-align:center">Kaligtasan ID Team Guide · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' });
await p.setViewportSize({ width: 794, height: 1123 }); await p.emulateMedia({ media: 'print' });
for (const [i, y] of [[1, 0], [2, 1123]]) await p.screenshot({ path: 'C:/Users/HP/AppData/Local/Temp/claude/6a046650d8471e6a/7e379232-3ee8-4a69-b867-24302c44931a/scratchpad/deck/g' + i + '.png', clip: { x: 0, y, width: 794, height: 1123 } });
await b.close();
