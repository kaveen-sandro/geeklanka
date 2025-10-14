import type { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from '../lib/firebaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postsSnap = await adminDb.collection('posts').where('published', '==', true).orderBy('publishedAt', 'desc').limit(100).get()
  const urls = postsSnap.docs.map((d) => `${siteUrl}/posts/${d.id}`)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
  for (const u of urls) xml += `<url><loc>${u}</loc></url>`
  xml += '</urlset>'
  res.setHeader('Content-Type', 'application/xml')
  res.status(200).send(xml)
}
