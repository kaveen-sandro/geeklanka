import type { NextApiRequest, NextApiResponse } from 'next'
import { adminDb, admin } from '../../../../lib/firebaseAdmin'

// Allowed admin emails (comma separated) from env
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean)

const POSTS_COLLECTION = 'posts'

function validatePostPayload(body: any) {
  if (!body || typeof body.title !== 'string' || typeof body.content !== 'string') return false
  return true
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // basic pagination: ?limit=10&after=<docId>
    const limit = Math.min(Number(req.query.limit) || 10, 50)
    const after = req.query.after as string | undefined

    const search = (req.query.q || '').toString().trim()
    const category = (req.query.category || '').toString().trim()
    const tag = (req.query.tag || '').toString().trim()

    let queryRef = adminDb.collection(POSTS_COLLECTION).orderBy('publishedAt', 'desc')

    if (search) {
      // simple prefix search on title
      const end = search + '\uf8ff'
      queryRef = adminDb.collection(POSTS_COLLECTION).where('title', '>=', search).where('title', '<=', end).orderBy('title').limit(limit)
    } else {
      // apply category or tag filters when provided
      if (category) {
        queryRef = adminDb.collection(POSTS_COLLECTION).where('category', '==', category).orderBy('publishedAt', 'desc').limit(limit)
      } else if (tag) {
        // tags stored as array
        queryRef = adminDb.collection(POSTS_COLLECTION).where('tags', 'array-contains', tag).orderBy('publishedAt', 'desc').limit(limit)
      } else {
        queryRef = queryRef.limit(limit)
        if (after) {
          const doc = await adminDb.collection(POSTS_COLLECTION).doc(after).get()
          if (doc.exists) queryRef = queryRef.startAfter(doc)
        }
      }
    }

  const snap = await queryRef.get()
    const items: any[] = []
    snap.forEach((d) => items.push({ id: d.id, ...d.data() }))
    return res.status(200).json(items)
  }

  if (req.method === 'POST') {
    // Verify Authorization header
    const auth = req.headers.authorization || ''
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' })
    const idToken = auth.split(' ')[1]
    try {
      const decoded = await admin.auth().verifyIdToken(idToken)
      if (ADMIN_EMAILS.length && !ADMIN_EMAILS.includes(decoded.email)) {
        return res.status(403).json({ error: 'Not allowed' })
      }
    } catch (err: any) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    if (!validatePostPayload(req.body)) return res.status(400).json({ error: 'Invalid payload' })
    const payload = {
      title: req.body.title,
      slug: req.body.slug || '',
      excerpt: req.body.excerpt || '',
      content: req.body.content,
      published: !!req.body.published,
      publishedAt: req.body.published ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const docRef = await adminDb.collection(POSTS_COLLECTION).add(payload)
    const created = await docRef.get()
    return res.status(201).json({ id: created.id, ...created.data() })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
