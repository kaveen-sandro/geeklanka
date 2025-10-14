import type { NextApiRequest, NextApiResponse } from 'next'
import { admin } from '../../lib/firebaseAdmin'

export const config = {
  api: {
    bodyParser: false,
  },
}

import formidable from 'formidable'

function parseForm(req: NextApiRequest) {
  const form = formidable({ multiples: false })
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const auth = (req.headers.authorization || '') as string
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' })
  const idToken = auth.split(' ')[1]
  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    // TODO: check admin email allowlist if needed
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  try {
    const { files } = await parseForm(req)
    const file = files.file
    if (!file) return res.status(400).json({ error: 'No file' })

    const bucket = admin.storage().bucket()
    const dest = `uploads/${Date.now()}_${(file as any).originalFilename || 'upload'}`
    await bucket.upload((file as any).filepath, { destination: dest, public: true })
    const fileObj = bucket.file(dest)
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${dest}`
    return res.status(200).json({ url: publicUrl })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || String(err) })
  }
}
