import * as React from "react"
import { useThemeContext } from "../contexts/ThemeContext"
import { useMediaQuery } from "../hooks/useMediaQuery"
import type { LinkItem } from "../types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "./ui/drawer"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface AddLinkModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onAdd: (title: string, url: string) => void
    editLink?: LinkItem | null
    onEdit?: (updated: LinkItem) => void
}

export function AddLinkModal({ open, setOpen, onAdd, editLink, onEdit }: AddLinkModalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const { mode } = useThemeContext()

    const [title, setTitle] = React.useState("")
    const [url, setUrl] = React.useState("")
    const [error, setError] = React.useState("")

    const isEditMode = !!editLink

    // Reset/populate form when opened
    React.useEffect(() => {
        if (open) {
            setTitle(editLink?.title ?? "")
            setUrl(editLink?.url ?? "")
            setError("")
        }
    }, [open, editLink])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !url.trim()) {
            setError("모든 필드를 입력해 주세요")
            return
        }

        let finalUrl = url.trim()

        // Basic URL validation/auto-protocol
        if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
            finalUrl = "https://" + finalUrl
        }

        if (isEditMode && editLink && onEdit) {
            onEdit({ ...editLink, title: title.trim(), url: finalUrl })
        } else {
            onAdd(title.trim(), finalUrl)
        }
        setOpen(false)
    }

    const btnClass = mode === 'work' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-pink-500 hover:bg-pink-600'
    const dialogTitle = isEditMode ? "링크 수정" : "Add New Link"
    const dialogDesc = isEditMode
        ? "링크 제목과 URL을 수정하세요."
        : `Add a new link to your ${mode} dashboard.`
    const submitLabel = isEditMode ? "저장" : "Save Link"

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>{dialogDesc}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">Title</label>
                            <Input
                                id="title"
                                placeholder="e.g. Google"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="url" className="text-sm font-medium">URL</label>
                            <Input
                                id="url"
                                placeholder="google.com or https://google.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <button type="submit" className={`w-full text-white ${btnClass} justify-center rounded-xl py-2.5 px-4 font-semibold mt-4 transition-colors`}>
                            {submitLabel}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{dialogTitle}</DrawerTitle>
                    <DrawerDescription>{dialogDesc}</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="px-4 pb-8 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            placeholder="e.g. Google"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-base min-h-[44px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium">URL</label>
                        <Input
                            id="url"
                            placeholder="google.com or https://google.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="text-base min-h-[44px]"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className={`w-full mt-2 h-12 text-base text-white ${btnClass}`}>
                        {submitLabel}
                    </Button>
                </form>
            </DrawerContent>
        </Drawer>
    )
}
