import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/original-public-structure.json',import.meta.url),'utf8'));
for(const [file,baseline] of Object.entries(fixture) as [string,any][]){
 const source=readFileSync(file,'utf8').replace(/^---[\s\S]*?---/,'');
 test(`${file}: original section order and containers`,()=>assert.deepEqual(source.match(/<section\b[^>]*>/gs)||[],baseline.sections));
 test(`${file}: original typography, spacing, backgrounds and card classes`,()=>assert.deepEqual(source.match(/\bclass=(?:"[^"]*"|\{`[^`]*`\}|\{[^\n]*?\})/g)||[],baseline.classes));
 test(`${file}: original page styles`,()=>assert.deepEqual(source.match(/<style\b[^>]*>[\s\S]*?<\/style>/g)||[],baseline.styles));
 if(!['src/pages/samples.astro','src/pages/contact.astro'].includes(file))test(`${file}: original animation/interaction scripts`,()=>assert.deepEqual(source.match(/<script\b[^>]*>[\s\S]*?<\/script>/g)||[],baseline.scripts));
}
const deps=JSON.parse(readFileSync(new URL('./fixtures/design-dependency-hashes.json',import.meta.url),'utf8'));
for(const [file,hash] of Object.entries(deps))test(`${file}: baseline design dependency unchanged`,()=>assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash));
test('contact form and its upload/security fields remain present',()=>{const s=readFileSync('src/pages/contact.astro','utf8');for(const marker of ['id="contact-form"','name="email"','name="message"','turnstile-container-contact','name="website"'])assert.ok(s.includes(marker),marker)});
test('no rejected editorial framework or bulk image integration',()=>{for(const p of ['src/components/EditorialPage.astro','src/styles/catalogue.css','public/images/catalogue'])assert.equal(existsSync(p),false,p)});
test('price estimator is retained but excluded from public catalogue',()=>{assert.ok(existsSync('src/components/PriceCalculator.astro'));assert.ok(!readFileSync('src/pages/products.astro','utf8').includes('<PriceCalculator'))});
