import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, resolveCategory, isEnquiryQuantity, enquiryUrl, enquiryContextNote } from '../src/lib/catalogue/policy.ts';
for (const c of categories) {
  test(`existing route ${c.slug} retains its enquiry identity`, () => {
    assert.equal(resolveCategory(c.slug)?.quoteId, c.quoteId);
    assert.equal(resolveCategory(c.sampleId)?.slug, c.slug);
    const url = new URL(enquiryUrl('quote', c.slug, 'rs-a024'), 'https://test.invalid');
    assert.equal(url.searchParams.get('product'), c.slug);
    assert.equal(url.searchParams.get('sample'), 'rs-a024');
    assert.match(enquiryContextNote(c.slug, 'rs-a024'), /rs-a024/);
  });
}
for (const [alias, expected] of Object.entries({ tshirts:'t-shirts', polos:'polo-shirts', ladies:'ladies-wear', kids:'kids-wear', custom:'specialized-fabrics', hoodies:'hoodies', joggers:'joggers', sweatshirts:'sweatshirts' })) {
  test(`legacy key ${alias}`, () => assert.equal(resolveCategory(alias)?.slug, expected));
}
test('unknown and hostile product IDs never select another product', () => {
  for (const x of [undefined, null, {}, '__proto__', 'unknown', '\"][onclick=alert(1)]']) assert.equal(resolveCategory(x), undefined);
});
test('normalizes case and whitespace', () => assert.equal(resolveCategory('  T Shirts  ')?.slug, 't-shirts'));
test('legitimate low-quantity enquiries stay possible without claiming production MOQ', () => {
  for (const n of [1,99,100,199,200,249,250,299,300,349,350,399,400,499,500,999,1000,2499,2500,4999,5000,10_000_000]) assert.equal(isEnquiryQuantity(n), true);
});
test('rejects unsafe or malformed quantities consistently', () => {
  for (const n of [0,-1,1.2,NaN,Infinity,10_000_001,'1.5','1e3','1x','',null,{},true,[]]) assert.equal(isEnquiryQuantity(n), false, String(n));
});
test('no untrusted sample IDs injected into handoff', () => assert.equal(enquiryUrl('samples', 'hoodies', '<script>'), '/samples/?product=hoodies'));
