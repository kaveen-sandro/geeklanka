import type { NextApiRequest, NextApiResponse } from 'next'
import { adminDb } from '../lib/firebaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postsSnap = await adminDb.collection('posts').where('published', '==', true).orderBy('publishedAt', 'desc').limit(50).get()
  const items = postsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Geek Lanka</title><link>${siteUrl}</link><description>Tech news</description>`
  for (const p of items) {
    xml += `<item><title>${p.title}</title><link>${siteUrl}/posts/${p.id}</link><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><description><![CDATA[${p.excerpt || ''}]]></description></item>`
  }
  xml += '</channel></rss>'
  res.setHeader('Content-Type', 'application/rss+xml')
  res.status(200).send(xml)
}
