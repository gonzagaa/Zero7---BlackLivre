// tools/stamp-assets.js
// 1) Carimba @import do index.css com ?v=<hash do import>
// 2) Carimba no index.html as refs de index.css e global.js com ?v=<hash real>

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function parseArg(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const INDEX_CSS  = path.resolve(process.cwd(), parseArg('--index-css')  || './css/index.css');
const INDEX_HTML = path.resolve(process.cwd(), parseArg('--index-html') || './index.html');
const JS_PATH    = path.resolve(process.cwd(), parseArg('--js')         || './script/global.js');

function mustExist(fp, label) {
  if (!fs.existsSync(fp)) {
    console.error(`[stamp-assets] ERRO: não encontrei ${label}: ${fp}`);
    process.exit(1);
  }
}
mustExist(INDEX_CSS, 'index.css');
mustExist(INDEX_HTML, 'index.html');
mustExist(JS_PATH, 'global.js');

function hashFile(fp){
  const buf = fs.readFileSync(fp);
  return crypto.createHash('md5').update(buf).digest('hex').slice(0,10);
}
function addOrReplaceV(urlStr, v){
  if (urlStr.includes('?')) {
    return /\bv=([^&#]*)/.test(urlStr) ? urlStr.replace(/\bv=([^&#]*)/, `v=${v}`) : `${urlStr}&v=${v}`;
  }
  return `${urlStr}?v=${v}`;
}

// (1) Carimbar @import no index.css
const baseDir = path.dirname(INDEX_CSS);
let css = fs.readFileSync(INDEX_CSS, 'utf8');

css = css.replace(
  /@import\s+(?:url\(\s*)?["']?([^"')]+\.css)["']?\s*\)?\s*;/g,
  (full, relPath) => {
    const targetPath = path.resolve(baseDir, relPath);
    if (!fs.existsSync(targetPath)) { console.warn(`[stamp-assets] Aviso: não achei ${relPath} (mantido).`); return full; }
    const h = hashFile(targetPath);
    const updated = addOrReplaceV(relPath, h);
    return `@import url("${updated}");`;
  }
);

fs.writeFileSync(INDEX_CSS, css, 'utf8');

// (2) Carimbar no index.html as refs de index.css e global.js
const hashCss = hashFile(INDEX_CSS);
const hashJs  = hashFile(JS_PATH);

let html = fs.readFileSync(INDEX_HTML, 'utf8');

html = html.replace(
  /(href\s*=\s*["'])([^"']*index\.css[^"']*)(["'])/i,
  (full, p1, url, p3) => `${p1}${addOrReplaceV(url, hashCss)}${p3}`
);

html = html.replace(
  /(src\s*=\s*["'])([^"']*global\.js[^"']*)(["'])/i,
  (full, p1, url, p3) => `${p1}${addOrReplaceV(url, hashJs)}${p3}`
);

fs.writeFileSync(INDEX_HTML, html, 'utf8');

console.log('[stamp-assets] OK');
console.log(' - CSS :', INDEX_CSS,  '=> ?v=' + hashCss);
console.log(' - JS  :', JS_PATH,    '=> ?v=' + hashJs);
console.log(' - HTML:', INDEX_HTML, 'atualizado');
