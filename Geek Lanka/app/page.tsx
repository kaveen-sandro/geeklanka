import Link from 'next/link'
import { adminDb } from '../lib/firebaseAdmin'

export default async function Home() {
  const snap = await adminDb.collection('posts').orderBy('publishedAt', 'desc').limit(10).get()
  const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Geek Lanka</h1>
        <p className="text-gray-600">Tech news and articles from Sri Lanka and beyond</p>
      </header>

      <section>
        {posts.map((p: any) => (
          <article key={p.id} className="mb-6">
            <h2 className="text-xl font-semibold">
              <Link href={`/posts/${p.id}`}>{p.title}</Link>
            </h2>
            <p className="text-gray-600 text-sm">{p.excerpt}</p>
          </article>
        ))}
      </section>
      <div className="mt-6">
        <a href="/posts" className="text-blue-600">View all posts</a>
      </div>
    </div>
  )
}
