import test from 'node:test';
import assert from 'node:assert/strict';
import { isReviewMode, reviewResponse } from '../src/lib/review-mode.ts';
test('all Vercel previews isolate live integrations', () => { const old=process.env.VERCEL_ENV; process.env.VERCEL_ENV='preview'; try {assert.equal(isReviewMode(),true)} finally { if(old===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=old; } });
test('production cannot be disabled by local review flag', () => { const old=process.env.VERCEL_ENV, flag=process.env.CATALOGUE_REVIEW_MODE;process.env.VERCEL_ENV='production';process.env.CATALOGUE_REVIEW_MODE='true';try{assert.equal(isReviewMode(),false)}finally{if(old===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=old;if(flag===undefined)delete process.env.CATALOGUE_REVIEW_MODE;else process.env.CATALOGUE_REVIEW_MODE=flag;} });
test('review endpoint does not report a request as submitted', async()=>{const r=reviewResponse();assert.equal(r.status,503);const b=await r.json();assert.equal(b.success,false);assert.match(b.error,/not been sent/)});
