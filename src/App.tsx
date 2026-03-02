import { useState } from 'react'
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { LinkCard } from './components/LinkCard'
import { FAB } from './components/FAB'
import { AddLinkModal } from './components/AddLinkModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { LinkItem } from './types'
import { Download, Upload } from 'lucide-react'
import { useRef } from 'react'

function AppContent() {
  const { mode } = useThemeContext()
  const [links, setLinks] = useLocalStorage<LinkItem[]>('linkdock_data', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = window.localStorage.getItem('linkdock_data') || '[]'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `linkdock_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (Array.isArray(data)) {
          setLinks(data)
          alert('데이터 복원이 완료되었습니다. (Data imported successfully!)')
        }
      } catch {
        alert('올바르지 않은 JSON 파일입니다. (Invalid JSON file)')
      }
    }
    reader.readAsText(file)
    // Clear input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddLink = (title: string, url: string) => {
    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      title,
      url,
      category: mode,
      createdAt: Date.now(),
    }
    setLinks([newLink, ...links])
  }

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const displayedLinks = links.filter((link) => {
    // 1. Filter by Mode
    if (link.category !== mode) return false
    // 2. Filter by Search Query
    if (searchQuery.trim() === '') return true

    const query = searchQuery.toLowerCase()
    return link.title.toLowerCase().includes(query) || link.url.toLowerCase().includes(query)
  })

  // Theme primary color
  const primaryColor = mode === 'work' ? '#4f46e5' : '#ec4899' // indigo-600 vs pink-500

  return (
    <div className="min-h-screen pb-24">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {displayedLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onDelete={handleDeleteLink}
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

      <footer className="fixed bottom-0 left-0 right-0 p-4 pb-6 md:p-6 pointer-events-none flex justify-between items-end z-40 max-w-5xl mx-auto">
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Import Backup JSON"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Export Backup JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImport}
            className="hidden"
          />
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
