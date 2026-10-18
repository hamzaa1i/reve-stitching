/** Review previews must never write into shared live integrations. */
export function isReviewMode(): boolean {
  return process.env.VERCEL_ENV === 'preview' || (process.env.VERCEL_ENV !== 'production' && process.env.CATALOGUE_REVIEW_MODE === 'true');
}
export function reviewResponse(): Response {
  return Response.json({ success: false, error: 'Review preview: your request has not been sent. Submission validation and live delivery are tested separately in an isolated environment.' }, { status: 503 });
}
