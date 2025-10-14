"use client"
import React, { useState } from 'react'
import { getFirebaseAuth, signOut } from '../../../lib/authClient'
import ReactMarkdown from 'react-markdown'

export default function AdminDashboard() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  async function createPost(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    try {
      const user = getFirebaseAuth().currentUser
      if (!user) throw new Error('Not authenticated')
      const token = await user.getIdToken()

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content, excerpt, published: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMsg('Post created: ' + data.id)
      setTitle('')
      setContent('')
      setExcerpt('')
    } catch (err: any) {
      setMsg(err.message || String(err))
    }
  }

  async function uploadFile(file: File | null) {
    if (!file) return
    setUploading(true)
    setMsg(null)
    try {
      const user = getFirebaseAuth().currentUser
      if (!user) throw new Error('Not authenticated')
      const token = await user.getIdToken()

      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      // insert markdown image into content
      setContent((c) => c + `\n\n![](${data.url})\n`)
      setMsg('Uploaded image')
    } catch (err: any) {
      setMsg(err.message || String(err))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <button onClick={() => signOut()} className="text-sm text-red-600">Sign out</button>
      </div>

      <form onSubmit={createPost} className="space-y-3">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border" />
  <input placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full p-2 border" />
  <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border" />
  <input placeholder="Tags (comma separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full p-2 border" />

        <div className="flex gap-2 items-center">
          <button type="button" onClick={() => setContent((c) => c + '**bold**')} className="px-2 py-1 bg-gray-200">Bold</button>
          <button type="button" onClick={() => setContent((c) => c + '_italic_')} className="px-2 py-1 bg-gray-200">Italic</button>
          <button type="button" onClick={() => setContent((c) => c + '\n# Heading\n')} className="px-2 py-1 bg-gray-200">H1</button>
          <label className="px-2 py-1 bg-gray-200 cursor-pointer">
            Insert image
            <input type="file" accept="image/*" onChange={(e) => uploadFile(e.target.files?.[0] ?? null)} className="hidden" />
          </label>
        </div>

        <textarea placeholder="Content (Markdown)" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border h-40" />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Create Post</button>
      </form>

      <div className="mt-6">
        <h3 className="font-semibold">Preview</h3>
        <div className="prose border p-4">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      {msg && <p className="mt-3">{msg}</p>}
    </div>
  )
}
