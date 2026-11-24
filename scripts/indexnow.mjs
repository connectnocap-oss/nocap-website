#!/usr/bin/env node
// Submit itsnocap.com's canonical pages to IndexNow (Bing, Yandex, Seznam, Naver, ...).
// Reads the live sitemap, keeps only URLs that return 200, point their canonical at
// themselves and are not noindex, then POSTs them in one batch.
//
//   node scripts/indexnow.mjs            submit every sitemap URL
//   node scripts/indexnow.mjs --dry-run  show what would be sent
//   node scripts/indexnow.mjs https://itsnocap.com/about/   submit specific URLs
//
// Run it after deploying a change to Hostinger. Node 18+ (built-in fetch).

const HOST = "itsnocap.com";
const KEY = "0c1fecd8097072d4cd3d120e522fb229"; // public by design: served at /<key>.txt
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const explicit = args.filter((a) => a.startsWith("https://"));

async function sitemapUrls() {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function isIndexable(url) {
  const res = await fetch(url, { redirect: "manual" });
  if (res.status !== 200) return [false, `HTTP ${res.status}`];
  if (/noindex/i.test(res.headers.get("x-robots-tag") ?? "")) return [false, "X-Robots-Tag noindex"];
  const html = await res.text();
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) return [false, "meta noindex"];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical !== url) return [false, `canonical is ${canonical ?? "missing"}`];
  return [true, "ok"];
}

const keyRes = await fetch(KEY_LOCATION);
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  console.error(`Key file not served correctly at ${KEY_LOCATION} - deploy it before submitting.`);
  process.exit(1);
}

const candidates = [...new Set(explicit.length ? explicit : await sitemapUrls())];
const urlList = [];
for (const url of candidates) {
  const [ok, why] = await isIndexable(url);
  console.log(`${ok ? "  submit" : "  skip  "} ${url} (${why})`);
  if (ok) urlList.push(url);
}
if (!urlList.length) process.exit(console.log("Nothing to submit."));

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
if (dryRun) process.exit(console.log(JSON.stringify(body, null, 2)));

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
const meaning = { 200: "OK", 202: "Accepted (key check pending)", 400: "Bad request", 403: "Key not valid", 422: "URLs don't match host or key", 429: "Too many requests" };
console.log(`IndexNow: HTTP ${res.status} ${meaning[res.status] ?? ""}`.trim());
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
