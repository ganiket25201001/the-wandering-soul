import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {memories} from '../src/memories.js';

const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
const config=JSON.parse(await readFile(path.join(root,'vercel.json'),'utf8'));
assert.equal(config.outputDirectory,'dist');
const html=await readFile(path.join(dist,'index.html'),'utf8');
assert(html.includes('<div id="root"></div>'),'Missing React mount point');
const assets=new Set(['/favicon.svg','/favicon.ico','/icon-32.png','/icon-64.png','/icon-180.png','/icon-192.png','/icon-512.png','/site.webmanifest','/social-preview.jpg','/images/next-spiti.webp','/images/next-kerala.webp','/images/next-meghalaya.webp']);
assets.add('/images/hero-parallax.webp');
assets.add('/images/hero-foreground.webp');
assert(!html.includes('__PUBLIC_SITE_URL__'),'Sharing URL was not substituted');
const shareImage=html.match(/property="og:image" content="([^"]+)"/);
assert(shareImage&&new URL(shareImage[1]).protocol==='https:','Share image must use an absolute HTTPS URL');
assert(html.includes('property="og:title"')&&html.includes('property="og:description"'),'Missing sharing title or description');
for(const match of html.matchAll(/(?:src|href)="(\/(?:assets\/[^"?#]+|favicon\.svg))"/g))assets.add(match[1]);
for(const entry of Object.values(memories).flat()){
  assert(entry.saw&&entry.felt,'Photo story is incomplete');
  for(const suffix of ['.png','.webp','.thumb.webp','.mobile.webp'])assets.add(entry.image.replace('.png',suffix));
}
// Case-sensitive file checks also run on Windows, matching Vercel's Linux filesystem.
for(const asset of assets){
  let current=dist;
  for(const part of asset.split('/').filter(Boolean)){
    const names=await readdir(current);
    assert(names.includes(part),`Missing or incorrectly cased production file: ${asset}`);
    current=path.join(current,part);
  }
  assert((await stat(current)).size>0,`Empty production file: ${asset}`);
}
console.log(`Production check passed: ${assets.size} assets, ${Object.values(memories).flat().length} photo stories, and Vercel configuration.`);
