#!/usr/bin/env python3
"""Rebuild approved catalogue derivatives from the private audit inventory.

Requires Pillow. Originals and decks deliberately remain outside this repository.
python scripts/process-catalogue.py --source-dir ../audit-work/assets --inventory ../audit-work/inventory.json
Optional --pilot-dir writes private six-sample comparisons. No generative edits.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps, ImageFilter, ImageDraw

SELECTION = [
    ('A027', 't-shirts', 'Grey script T-shirt', 'Grey short-sleeve T-shirt with Dsgn Studio script chest graphic on a hanger.'),
    ('A040', 't-shirts', 'Charcoal 98 graphic T-shirt', 'Charcoal short-sleeve T-shirt with a large tonal 98 chest graphic on a hanger.'),
    ('A041', 't-shirts', 'Cream typographic T-shirt', 'Cream short-sleeve T-shirt with stacked black typography on a hanger.'),
    ('A033', 'polo-shirts', 'Contrast-collar rugby top', 'Black long-sleeve rugby-style top with a white collar and small chest graphic on a hanger.'),
    ('A038', 'polo-shirts', 'California 06 rugby top', 'Cream and navy long-sleeve rugby-style top with California 06 graphics and striped cuffs on a hanger.'),
    ('A049', 'polo-shirts', 'Red striped rugby top', 'Red and cream wide-striped long-sleeve rugby-style top with a pointed collar on a hanger.'),
    ('A051', 'polo-shirts', 'New York striped rugby top', 'Green and cream wide-striped long-sleeve rugby-style top with New York script on a hanger.'),
    ('A046', 'hoodies', 'Black script zip hoodie', 'Black full-zip hoodie with a white script chest graphic and ribbed hem on a hanger.'),
    ('A057', 'hoodies', 'New York 06 hoodie', 'Grey pullover hoodie with New York State USA 06 chest graphics and a kangaroo pocket on a hanger.'),
    ('A071', 'hoodies', 'Grey NYC zip hoodie', 'Grey full-zip hoodie with a stacked NYC 98 chest graphic on a hanger.'),
    ('A030', 'joggers', 'Charcoal wide-leg trousers', 'Plain charcoal wide-leg trousers with an elasticated waistband on a clip hanger.'),
    ('A055', 'joggers', 'Cropped drawstring trousers', 'Charcoal cropped wide-leg trousers with a drawstring waistband and side pocket on a clip hanger.'),
    ('A065', 'joggers', 'Washed wide-leg trousers', 'Washed charcoal wide-leg trousers with a drawstring waistband on a clip hanger.'),
    ('A024', 'sweatshirts', 'Contrast-sleeve raglan sweatshirt', 'Dark crew-neck sweatshirt with brown contrast raglan sleeves on a hanger.'),
    ('A035', 'sweatshirts', 'Grey script sweatshirt', 'Light grey crew-neck sweatshirt with a black Dsgn Studio script chest graphic on a hanger.'),
    ('A060', 'sweatshirts', 'Black raglan sweatshirt', 'Black crew-neck sweatshirt with visible tonal raglan seam detailing on a hanger.'),
    ('A104', 'ladies-wear', 'Pink striped hooded sweatshirt', 'Pale pink hooded sweatshirt with horizontal light stripes and a front graphic on a hanger.'),
    ('A121', 'ladies-wear', 'Light grey graphic hoodie', 'Light grey hooded sweatshirt with pink DSGN Studio lettering and a kangaroo pocket on a hanger.'),
    ('A122', 'ladies-wear', 'Light grey matching trousers', 'Light grey trousers with a drawstring waistband on a clip hanger, from the same sample presentation as the grey graphic hoodie.'),
    ('A137', 'ladies-wear', 'Tonal graphic hoodie', 'Grey pullover hoodie with tonal ATH CLUB 89 lettering on a hanger.'),
    ('A164', 'ladies-wear', 'Striped collared top', 'Fine-striped short-sleeve collared top with an open V neckline on a hanger.'),
    ('A165', 'ladies-wear', 'Striped wide-leg trousers', 'Fine-striped wide-leg trousers on a clip hanger, from the same sample presentation as the striped collared top.'),
    ('A195', 'kids-wear', 'Pink ROSES T-shirt', 'Pink short-sleeve ROSES graphic T-shirt photographed flat with its original sample tag.'),
    ('A048', 'specialized-fabrics', 'Washed sweatshirt development', 'Washed charcoal crew-neck sweatshirt with a tonal front graphic on a hanger.'),
    ('A058', 'specialized-fabrics', 'Camouflage zip-jacket development', 'Green and brown camouflage cropped full-zip collared jacket on a hanger.'),
    ('A059', 'specialized-fabrics', 'Camouflage trouser development', 'Green and brown camouflage wide-leg trousers on a clip hanger.'),
    ('A061', 'specialized-fabrics', 'Contrast-sleeve graphic development', 'Grey ICONIC graphic T-shirt with camouflage raglan sleeves on a hanger.'),
    ('A062', 'specialized-fabrics', 'Camouflage T-shirt development', 'Green and brown camouflage short-sleeve T-shirt on a hanger.'),
]
PILOT_IDS = {'A027', 'A049', 'A046', 'A024', 'A104', 'A195'}
RECIPE = {
    'version': 'faithful-v1', 'orientation': 'EXIF transpose', 'crop': 'none',
    'background': 'original retained; neutral #efeeeb canvas padding only when needed',
    'aspectRatio': '3:4', 'brightness': 1.045, 'contrast': 1.025,
    'saturation': 1.0, 'whiteBalance': 'unchanged to protect garment colour',
    'sharpening': {'radius': 0.6, 'percent': 65, 'threshold': 3},
    'webp': {'quality': 84, 'method': 6, 'exact': True},
    'requestedWidths': [360, 640, 960], 'upscaling': False,
    'constructionGraphicsPreserved': True,
}

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source-dir', required=True, type=Path)
    p.add_argument('--inventory', required=True, type=Path)
    p.add_argument('--output-root', type=Path, default=Path(__file__).resolve().parents[1])
    p.add_argument('--pilot-dir', type=Path)
    args = p.parse_args()
    rows = {r['asset_id']: r for r in json.loads(args.inventory.read_text())}
    out = args.output_root / 'public/images/catalogue'
    out.mkdir(parents=True, exist_ok=True)
    media, manifest = [], []
    for source_id, category, title, alt in SELECTION:
        row = rows[source_id]
        source = args.source_dir / Path(row['local_path']).name
        if sha(source) != row['sha256']:
            raise ValueError(f'Source checksum mismatch: {source_id}')
        original = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
        enhanced = ImageEnhance.Brightness(original).enhance(RECIPE['brightness'])
        enhanced = ImageEnhance.Contrast(enhanced).enhance(RECIPE['contrast'])
        enhanced = enhanced.filter(ImageFilter.UnsharpMask(**RECIPE['sharpening']))
        # A common canvas preserves every pixel of the actual garment; no content-aware fill.
        canvas_width = max(original.width, round(original.height * 3 / 4))
        canvas_height = max(original.height, round(original.width * 4 / 3))
        canvas = Image.new('RGB', (canvas_width, canvas_height), '#efeeeb')
        canvas.paste(enhanced, ((canvas_width-original.width)//2, (canvas_height-original.height)//2))
        # Cap the whole canvas width at the source width so source pixels never upscale.
        widths = sorted(set(min(w, original.width) for w in RECIPE['requestedWidths']))
        sample_id = f'rs-{source_id.lower()}'
        images, outputs = [], []
        for width in widths:
            size = (width, round(canvas_height * width / canvas_width))
            resized = canvas.resize(size, Image.Resampling.LANCZOS)
            name = f'{sample_id}-{width}.webp'
            target = out / name
            temporary = target.with_suffix('.webp.tmp')
            resized.save(temporary, 'WEBP', **RECIPE['webp'])
            temporary.replace(target)
            image_data = {'src': f'/images/catalogue/{name}', 'width': width, 'height': size[1]}
            images.append(image_data)
            outputs.append({**image_data, 'bytes': target.stat().st_size, 'sha256': sha(target)})
        source_approval = {'status': 'owner-confirmed', 'date': '2026-10-18', 'scope': 'Reve-manufactured; website publication and faithful enhancement authorized'}
        pairs = {'A121': ['rs-a122'], 'A122': ['rs-a121'], 'A164': ['rs-a165'], 'A165': ['rs-a164']}
        entry = {'relatedSampleIds': pairs.get(source_id, []), 'sampleId': sample_id, 'sourceId': source_id, 'categorySlug': category,
                 'title': title, 'alt': alt, 'images': images, 'originalFilename': row['original_filename'],
                 'sourceDeck': row['source_deck'] or None, 'sourceSlide': str(row['slides']) or None,
                 'sourceApproval': source_approval, 'enhancementRecipe': RECIPE['version']}
        media.append(entry)
        manifest.append({**entry, 'source': {'width': original.width, 'height': original.height, 'sha256': sha(source),
                         'exactDuplicates': row.get('exact_duplicates') or None},
                         'recipe': RECIPE, 'outputs': outputs,
                         'classificationNote': 'Finish and pattern development only; no fibre, technical-performance or certification inference.' if category == 'specialized-fabrics' else 'Visual sample classification; no fibre, weight, lead-time or compliance inference.'})
        if args.pilot_dir and source_id in PILOT_IDS:
            args.pilot_dir.mkdir(parents=True, exist_ok=True)
            pair = Image.new('RGB', (800, 584), '#f6f5f2')
            draw = ImageDraw.Draw(pair)
            for j, (img, label) in enumerate([(original, 'Original'), (canvas, 'Faithful enhancement')]):
                thumb = ImageOps.contain(img, (390, 540))
                pair.paste(thumb, (j*400+(400-thumb.width)//2, 30+(540-thumb.height)//2))
                draw.text((j*400+12, 10), f'{source_id} | {label}', fill='#222222')
            pair.save(args.pilot_dir / f'{sample_id}-comparison.jpg', quality=92)
    ts = '''/** Approved Reve-made sample photography. Source originals remain private. */
export type CatalogueCategorySlug = "t-shirts" | "polo-shirts" | "hoodies" | "joggers" | "sweatshirts" | "ladies-wear" | "kids-wear" | "specialized-fabrics";
export interface CatalogueImage { src: string; width: number; height: number }
export interface CatalogueMedia {
  sampleId: string;
  sourceId: string;
  categorySlug: CatalogueCategorySlug;
  relatedSampleIds: string[];
  title: string;
  alt: string;
  images: CatalogueImage[];
  originalFilename: string;
  sourceDeck: string | null;
  sourceSlide: string | null;
  sourceApproval: { status: string; date: string; scope: string };
  enhancementRecipe: string;
}
export const catalogueMedia: CatalogueMedia[] = ''' + json.dumps(media, indent=2, ensure_ascii=False) + ';\n'
    (args.output_root / 'src/data/catalogue-media.ts').write_text(ts)
    (args.output_root / 'docs/catalogue-media-manifest.json').write_text(json.dumps({
        'version': 1, 'approvalDate': '2026-10-18', 'sourceCount': len(manifest),
        'notes': ['Each record is an approved photographic sample view, not a separate SKU or product count.',
                  'No generated garment detail; colours and graphics retained; no upscaling.',
                  'Pillow/WebP versions can affect encoded byte hashes; recipes and source checksums are authoritative.'],
        'samples': manifest}, indent=2))
    if args.pilot_dir:
        cards = ''.join(f'<article><h2>{sid}</h2><img src="rs-{sid.lower()}-comparison.jpg" alt="Original and enhanced {sid}"></article>' for sid in sorted(PILOT_IDS))
        (args.pilot_dir / 'index.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>Private image quality pilot</title><style>body{font:16px system-ui;background:#f1f0ec;color:#222;margin:32px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(480px,1fr));gap:24px}img{width:100%;height:auto}article{background:white;padding:16px}h1{font-size:28px}h2{font-size:16px}</style><h1>Six-image faithful enhancement pilot</h1><p>Original background, garment construction, artwork and colour relationships retained. Gentle brightness, contrast and sharpening only. No generative edits. No review approval is implied by this pilot.</p><main>'+cards+'</main></html>')
    # Validate every published derivative after all writes have completed.
    for item in manifest:
        for output in item['outputs']:
            target = args.output_root / 'public' / output['src'].lstrip('/')
            with Image.open(target) as check:
                check.load()
                assert check.size == (output['width'], output['height'])
            assert sha(target) == output['sha256'], f'Output checksum mismatch: {target}'
    print(json.dumps({'samples': len(media), 'derivatives': sum(len(m['images']) for m in media),
                      'bytes': sum(o['bytes'] for m in manifest for o in m['outputs'])}))

if __name__ == '__main__':
    main()
