"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Post = { id: string; title: string; excerpt?: string; publishedAt?: string }

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [after, setAfter] = useState<string | undefined>(undefined)
  const [q, setQ] = useState('')
  const [hasMore, setHasMore] = useState(true)

  async function load(reset = false) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', '10')
      if (after && !reset) params.set('after', after)
      if (q) params.set('q', q)
      const res = await fetch('/api/posts?' + params.toString())
      const data = await res.json()
      if (reset) setPosts(data)
      else setPosts((p) => p.concat(data))
      if (!data || data.length < 10) setHasMore(false)
      if (data && data.length) setAfter(data[data.length - 1].id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // initial load
    load(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">All posts</h1>
        <div className="mt-3">
          <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} className="p-2 border mr-2" />
          <button onClick={() => { setAfter(undefined); setHasMore(true); load(true) }} className="px-3 py-1 bg-blue-600 text-white">Search</button>
        </div>
      </header>

      <section>
        {posts.map((p) => (
          <article key={p.id} className="mb-4">
            <h2 className="text-lg font-semibold"><Link href={`/posts/${p.id}`}>{p.title}</Link></h2>
            {p.excerpt && <p className="text-gray-600">{p.excerpt}</p>}
          </article>
        ))}
      </section>

      <div className="mt-6">
        {hasMore ? (
          <button onClick={() => load()} disabled={loading} className="px-4 py-2 bg-gray-200">
            {loading ? 'Loading...' : 'Load more'}
          </button>
        ) : (
          <p>No more posts</p>
        )}
      </div>
    </div>
  )
}
