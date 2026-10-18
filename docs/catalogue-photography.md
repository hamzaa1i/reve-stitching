# Catalogue photography

The owner confirmed on 18 October 2026 that all supplied ZIP photography depicts Reve-manufactured garments and is approved for website publication and faithful enhancement. This supersedes the preliminary audit's unconfirmed provenance classifications.

The catalogue curates 28 photographic views, not 28 separately verified SKUs: three T-shirts, four polo/rugby-style tops, three hoodies, three trouser examples, three sweatshirts, six women's views including two coordinated top/trouser pairs, one explicitly identified children's T-shirt, and five finish/pattern developments. A common 3:4 canvas retains the full original photograph. Original garment construction, graphics, colours, hangers, sample tags and background texture remain visible. No synthetic garment detail or generative background replacement is used.

Processing applies brightness 1.045, contrast 1.025 and restrained unsharp masking; white balance and saturation remain unchanged. WebP derivatives use widths 360, 640 and 960 where supported, capped at native source width. Smaller slide images have fewer variants. Sources remain outside the repository, and source-file SHA-256 checksums are verified before conversion. The detailed manifest records output dimensions, bytes, checksums and the recipe.

Run from the repository root with Python and Pillow installed:

```bash
python scripts/process-catalogue.py \
  --source-dir ../audit-work/assets \
  --inventory ../audit-work/inventory.json \
  --pilot-dir ../audit-work/quality-pilot
```

The optional pilot writes six paired original/enhanced images and a private HTML contact sheet outside the public website. The script regenerates `src/data/catalogue-media.ts`, `docs/catalogue-media-manifest.json` and `public/images/catalogue/`. Byte output may vary with Pillow/libwebp versions; source checksums and transformation settings establish traceability.

Use `relatedSampleIds` to associate the matching women's top/trouser views. The specialized-fabrics route retains its existing URL, but its selected photographs demonstrate visible washed finishes, camouflage patterns and contrast panels only. They establish no fibre content, certified performance or compliance claim. Likewise the category grouping does not establish fabric weight or composition for other samples. The children's category intentionally contains one explicit children's sample rather than assigning adult garments to that route.
