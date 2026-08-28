import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const heroPath = new URL("../src/components/century-home/HeroSection.tsx", import.meta.url);
const casesPath = new URL("../src/components/century-home/CenturySection.tsx", import.meta.url);
const casesIntroPath = new URL("../src/components/century-home/CasesIntroSection.tsx", import.meta.url);
const nginxPath = new URL("../nginx.conf", import.meta.url);
const originalHeroPath = new URL("../public/hero-video/century-main-visual.mp4", import.meta.url);
const compressedHeroPath = new URL("../public/hero-video/century-main-visual-compressed.mp4", import.meta.url);

test("hero keeps the original quality while showing a clean fallback until it can play", async () => {
  const [hero, cases, casesIntro, nginx] = await Promise.all([
    readFile(heroPath, "utf8"),
    readFile(casesPath, "utf8"),
    readFile(casesIntroPath, "utf8"),
    readFile(nginxPath, "utf8"),
  ]);

  assert.match(hero, /const fallbackPoster = "\/hero-video\/hero-fallback\.png"/);
  assert.match(hero, /poster=\{fallbackPoster\}/);
  assert.match(hero, /preload="auto"/);
  assert.match(hero, /century-main-visual\.mp4/);
  assert.doesNotMatch(hero, /century-main-visual-compressed\.mp4/);
  assert.match(hero, /century-home-hero__placeholder/);
  assert.match(hero, /className="century-home-hero__overlay"/);
  assert.match(hero, /onPlaying=\{handleVideoPlaying\}/);
  assert.match(cases, /src=\{src\}/);
  assert.match(cases, /preload="auto"/);
  assert.match(cases, /century-cases__video-placeholder/);
  assert.match(cases, /onLoadedData=\{\(\) => setHasLoadedFrame\(true\)\}/);
  assert.match(cases, /video\.readyState < HTMLMediaElement\.HAVE_CURRENT_DATA/);
  assert.doesNotMatch(casesIntro, /cases-intro-slide__word-space/);
  assert.match(nginx, /Cache-Control "public, max-age=2592000, immutable"/);
  await Promise.all([readFile(originalHeroPath), readFile(compressedHeroPath)]);
});
