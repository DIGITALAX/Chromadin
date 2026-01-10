import { NextResponse } from "next/server";
import { INFURA_GATEWAY_INTERNAL, VIDEO_COVERS } from "../lib/constants";
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

function getSafeSlug(raw: string) {
  if (!raw) return "";
  return encodeURIComponent(raw.replace(/\s+/g, "-"));
}

function getAutographSlug(coll: any) {
  const rawAutograph =
    coll?.designer?.toString()?.trim() || coll?.metadata?.microbrand?.toString()?.trim();
  return getSafeSlug(rawAutograph);
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://chromadin.xyz";
  const gallery = await getAllCollections();

  const collections = gallery?.data?.collectionCreateds || [];

  const videoCoverMap = new Map(
    VIDEO_COVERS.map((item) => [item.id, item.poster])
  );

  const videosXml = collections
    .filter((coll: any) => {
      const collId = coll?.collectionId?.toString();
      return videoCoverMap.has(collId);
    })
    .map((coll: any) => {
      const rawTitle = coll?.metadata?.title ?? "";
      const safeSlug = getSafeSlug(rawTitle);
      const autographSlug = getAutographSlug(coll);
      const title = escapeXml(rawTitle.replace(/-/g, " "));
      const collId = coll?.collectionId?.toString();
      const posterHash = videoCoverMap.get(collId);
      const description = escapeXml(
        coll?.metadata?.description ?? `${title} - Web3 Fashion NFT Collection by DIGITALAX on Chromadin`
      );

      const videoUrl = coll?.metadata?.video?.split("ipfs://")?.[1];

      if (!safeSlug || !autographSlug || !posterHash) {
        return "";
      }

      return `
      <url>
        <loc>${baseUrl}/autograph/${autographSlug}/collection/${safeSlug}/</loc>
        ${locales
          .map(
            (altLocale) => `
          <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/autograph/${autographSlug}/collection/${safeSlug}/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/autograph/${autographSlug}/collection/${safeSlug}/" />
        <video:video>
          <video:thumbnail_loc>${INFURA_GATEWAY_INTERNAL}${posterHash}</video:thumbnail_loc>
          <video:title><![CDATA[${title} | Web3 Fashion | DIGITALAX | Chromadin]]></video:title>
          <video:description><![CDATA[${description}]]></video:description>
          ${videoUrl ? `<video:content_loc>${INFURA_GATEWAY_INTERNAL}${videoUrl}</video:content_loc>` : ""}
          <video:player_loc>${baseUrl}/autograph/${autographSlug}/collection/${safeSlug}/</video:player_loc>
          <video:family_friendly>yes</video:family_friendly>
          <video:requires_subscription>no</video:requires_subscription>
          <video:uploader info="${baseUrl}/">Chromadin</video:uploader>
          <video:platform relationship="allow">web mobile</video:platform>
        </video:video>
      </url>
    `;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      ${videosXml}
    </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
