"use client"
import React, { useState, useEffect } from 'react'
import { signIn, getFirebaseAuth } from '../../lib/authClient'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsub = getFirebaseAuth().onAuthStateChanged((u) => {
      if (u) router.push('/admin/dashboard')
    })
    return () => unsub()
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await signIn(email, password)
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Sign in failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admin Sign In</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  )
}
