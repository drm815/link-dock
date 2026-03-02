import { useState } from 'react'
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { LinkCard } from './components/LinkCard'
import { FAB } from './components/FAB'
import { AddLinkModal } from './components/AddLinkModal'
import { SheetSetup } from './components/SheetSetup'
import { useGoogleSheet } from './hooks/useGoogleSheet'
import type { LinkItem } from './types'
import { RefreshCw } from 'lucide-react'

function AppContent() {
  const { mode } = useThemeContext()
  const { links, syncing, error, isConfigured, scriptUrl, saveScriptUrl, addLink, deleteLink, refetch } = useGoogleSheet()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddLink = (title: string, url: string) => {
    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      title,
      url,
      category: mode,
      createdAt: Date.now(),
    }
    addLink(newLink)
  }

  const displayedLinks = links.filter((link) => {
    if (link.category !== mode) return false
    if (searchQuery.trim() === '') return true
    const query = searchQuery.toLowerCase()
    return link.title.toLowerCase().includes(query) || link.url.toLowerCase().includes(query)
  })

  const primaryColor = mode === 'work' ? '#4f46e5' : '#ec4899'

  return (
    <div className="min-h-screen pb-24">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {error && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-4">
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2">
            {error}
          </div>
        </div>
      )}

      {!isConfigured && (
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
          <div className="flex flex-col items-center justify-center h-[40vh] text-center gap-4">
            <p className="text-muted-foreground">구글 시트가 연동되지 않았습니다.</p>
            <SheetSetup currentUrl={scriptUrl} onSave={saveScriptUrl} />
          </div>
        </div>
      )}

      {isConfigured && (
        <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          {displayedLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={deleteLink}
                  primaryColor={primaryColor}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-muted text-muted-foreground transition-colors"
                style={{ color: primaryColor }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">No links found</h2>
              <p className="text-muted-foreground max-w-[280px]">
                {searchQuery
                  ? "No links match your search."
                  : `You don't have any links in ${mode} mode yet. Click the + button to add one.`}
              </p>
            </div>
          )}
        </main>
      )}

      <footer className="fixed bottom-0 left-0 right-0 p-4 pb-6 md:p-6 pointer-events-none flex justify-between items-end z-40 max-w-5xl mx-auto">
        <div className="flex gap-2 pointer-events-auto">
          <SheetSetup currentUrl={scriptUrl} onSave={saveScriptUrl} />
          <button
            onClick={refetch}
            disabled={syncing}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="pointer-events-auto">
          <FAB onClick={() => setIsAddModalOpen(true)} />
        </div>
      </footer>

      <AddLinkModal
        open={isAddModalOpen}
        setOpen={setIsAddModalOpen}
        onAdd={handleAddLink}
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
