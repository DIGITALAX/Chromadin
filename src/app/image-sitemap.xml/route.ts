import { NextResponse } from "next/server";
import { INFURA_GATEWAY_INTERNAL } from "../lib/constants";
import { getAllCollections } from "../../../graph/queries/getAllCollections";

const locales = ["en", "es"];

function escapeXml(unsafe: string) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://chromadin.xyz";
  const gallery = await getAllCollections();

  const collections = gallery?.data?.collectionCreateds || [];

  const collectionsXml = collections
    .map((coll: any) => {
      const rawTitle = coll?.metadata?.title ?? "";
      const safeSlug = encodeURIComponent(rawTitle.replace(/\s+/g, "-"));
      const title = escapeXml(rawTitle.replace(/-/g, " "));
      const image = coll?.metadata?.images?.[0]?.split("ipfs://")?.[1];

      return `
      <url>
        <loc>${baseUrl}/autograph/collection/${safeSlug}/</loc>
        ${locales
          .map(
            (altLocale) => `
          <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/autograph/collection/${safeSlug}/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/autograph/collection/${safeSlug}/" />
        <image:image>
          <image:loc>${INFURA_GATEWAY_INTERNAL}${image}</image:loc>
          <image:title><![CDATA[${title} | Chromadin | DIGITALAX]]></image:title>
          <image:caption><![CDATA[${title} | Chromadin | DIGITALAX]]></image:caption>
        </image:image>
      </url>
    `;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      ${collectionsXml}
    </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
