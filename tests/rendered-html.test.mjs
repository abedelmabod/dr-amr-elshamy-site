import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the dental clinic homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Dr\. Amr Elshamy Dental Clinic/i);
  assert.match(html, /\/brand\/logo-transparent\.png/);
  assert.match(html, /\/brand\/dr-amr-hero-premium\.png/);
  assert.match(html, /\/brand\/dentax-inspired-teeth\.png/);
  assert.match(html, /\/icons\/implant\.png/);
  assert.match(html, /\/icons\/success-chart\.png/);
  assert.match(html, /واتساب|WhatsApp/i);
  assert.match(html, /application\/ld\+json/);
});

test("keeps service pages and premium assets wired", async () => {
  const response = await render("/services/dental-implants");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Specialized Service|خدمة متخصصة/);
  assert.match(html, /\/icons\/implant\.png/);
  assert.match(html, /Book This Service|احجز الخدمة/);

  await Promise.all([
    access(new URL("../public/brand/dr-amr-hero-premium.png", import.meta.url)),
    access(new URL("../public/brand/dentax-inspired-teeth.png", import.meta.url)),
    access(new URL("../public/icons/implant.png", import.meta.url)),
    access(new URL("../public/inner/clinic-treatment.png", import.meta.url)),
    access(new URL("../public/inner/map-gold-pin.png", import.meta.url)),
  ]);

  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /"@type": "Dentist"/);
  assert.match(layout, /Dr\. Amr Elshamy Dental Clinic/);
});
