import { GetServerSideProps } from 'next'
import { adminDb } from '../../../lib/firebaseAdmin'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'

export default function PostPage({ post }: { post: any }) {
  if (!post) return <div>Not found</div>
  return (
    <article>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-gray-600">{post.excerpt}</p>
      <p className="text-sm text-gray-500">{post.publishedAt ? format(new Date(post.publishedAt), 'PPP') : ''} {post.category ? `· ${post.category}` : ''}</p>
      {post.tags && post.tags.length > 0 && (
        <p className="text-sm mt-2">Tags: {post.tags.join(', ')}</p>
      )}
      <div className="prose mt-6">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string
  const doc = await adminDb.collection('posts').doc(id).get()
  if (!doc.exists) return { notFound: true }
  return { props: { post: { id: doc.id, ...doc.data() } } }
}
