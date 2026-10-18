import test from 'node:test';
import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import { catalogueMedia } from '../src/data/catalogue-media.ts';
import { categories } from '../src/lib/catalogue/policy.ts';
test('curation covers every retained route without claiming distinct garments',()=>{assert.equal(catalogueMedia.length,28);for(const c of categories) assert.ok(catalogueMedia.some(s=>s.categorySlug===c.slug),c.slug);assert.equal(new Set(catalogueMedia.map(s=>s.sampleId)).size,catalogueMedia.length)});
for(const sample of catalogueMedia){test(`${sample.sampleId} media contract`,()=>{assert.ok(sample.alt.length>20);assert.equal(sample.sourceApproval.status,'owner-confirmed');assert.ok(sample.images.length>0);for(const image of sample.images){assert.ok(image.width>0&&image.height>0);assert.ok(statSync('public'+image.src).size>0);assert.ok(image.src.startsWith('/images/catalogue/'));}for(const related of sample.relatedSampleIds)assert.ok(catalogueMedia.some(s=>s.sampleId===related));});}
test('catalogue contains none of the redundant exact-copy source IDs',()=>{for(const s of catalogueMedia)assert.ok(!['A085','A086','A092'].includes(s.sourceId))});
