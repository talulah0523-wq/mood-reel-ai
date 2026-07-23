import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("服务端渲染 MOOD REEL 当前首页", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /MOOD REEL/);
  assert.match(html, /为此刻的心情/);
  assert.match(html, /电影数据持续更新/);
  assert.doesNotMatch(html, /已收录\s*3[,，]?000\s*部/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
});

test("片库数量与新增数据不会在页面中硬编码", async () => {
  const [page, catalog] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/catalog.ts", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(page, /已收录\s*["'`{ ]*3[,，]?000\s*部/);
  assert.doesNotMatch(page, /10[,，]?000\+\s*部/);
  assert.match(page, /电影数据持续更新/);
  assert.match(page, /const films: Film\[\] = \[\.\.\.featuredFilms, \.\.\.catalogAdditions\]/);
  assert.doesNotMatch(page, /extendedCatalog/);

  const featuredCount = page
    .slice(page.indexOf("const featuredFilms"), page.indexOf("const films: Film[]"))
    .match(/^\s{4}title:/gm)?.length ?? 0;
  const catalogCount = catalog.match(/^\s{6}\["/gm)?.length ?? 0;
  assert.equal(featuredCount + catalogCount, 200);
});
