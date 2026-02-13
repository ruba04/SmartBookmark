'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Bookmark, LogOut, Plus, Trash2 } from 'lucide-react'

interface BookmarkType {
  id: string
  url: string
  title: string
  user_id: string
  created_at: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    checkUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchBookmarks()
    }
  }, [user])

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    setUser(session?.user ?? null)
    setLoading(false)
  }

  async function fetchBookmarks() {
    if (!user) return

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      console.error('Error signing in:', error)
      alert('Error signing in with Google')
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setBookmarks([])
  }

  async function addBookmark(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !newUrl || !newTitle) return

    setIsAdding(true)

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          url: newUrl,
          title: newTitle,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error adding bookmark:', error)
      alert('Error adding bookmark')
    } else if (data) {
      // Instant update
      setBookmarks((current) => [data, ...current])
      setNewUrl('')
      setNewTitle('')
    }

    setIsAdding(false)
  }

  async function deleteBookmark(id: string) {
  
    const previous = bookmarks
    setBookmarks((current) =>
      current.filter((bookmark) => bookmark.id !== id)
    )

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting bookmark:', error)
      alert('Error deleting bookmark')
      setBookmarks(previous) 
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Bookmark className="w-12 h-12 text-indigo-600" />
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">
            Smart Bookmark App
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Save and organize your favorite links
          </p>

          <button onClick={signInWithGoogle}
           className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3"
          >
  <svg className="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>

  Sign in with Google
</button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold">Smart Bookmark App</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
       
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Bookmark
          </h2>

          <form onSubmit={addBookmark} className="space-y-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={isAdding}
              className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
              {isAdding ? 'Adding...' : 'Add Bookmark'}
            </button>
          </form>
        </div>

        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            My Bookmarks ({bookmarks.length})
          </h2>

          {bookmarks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No bookmarks yet.
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {bookmark.title}
                    </h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 truncate block"
                    >
                      {bookmark.url}
                    </a>
                  </div>

                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="ml-4 text-red-600 hover:text-red-800 transition p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
