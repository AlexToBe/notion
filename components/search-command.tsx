'use client'
import { useEffect, useState } from "react"
import { File } from "lucide-react"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"


import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'

import { useSearch } from "../hooks/use-search"
import { api } from "@/convex/_generated/api"

export const SearchCommand = () => {
    const { user } = useUser()
    const router = useRouter()
    const documents = useQuery(api.documents.getSearch)
    const [isMounted,setIsMounted] = useState(false)
    const toggle = useSearch((state) => state.toggle)
    const isOpen = useSearch((state) => state.isOpen)
    // const onOpen = useSearch((state) => state.onOpen)
    const onClose = useSearch((state) => state.onClose)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {

            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                toggle()
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [toggle])

    const onSelect = (id:string) => {
        router.push(`/documents/${id.split('-')[0]}`)
        onClose()
    }

    if (!isMounted) {
        return null
    }
    return (

        <CommandDialog open = {isOpen} onOpenChange={onClose}>
            <CommandInput
                placeholder={`Search ${user?.username}'s jotion...`}
            />
            <CommandList>
                <CommandEmpty>
                    No results found.
                </CommandEmpty>
                <CommandGroup heading = 'Documents'>
                    {documents?.map((document) => (
                        <CommandItem
                            key={document._id}
                            value={`${document._id}-${document.title}`}
                            title={document.title}
                            onSelect={onSelect}
                        >
                            {document.icon ? (
                                <p className=" mr-2 text-[18px">
                                    {document.icon}
                            </p>
                            ) : (
                                    <File className="h-4 w-4 mr-2" />
                            )}
                            <span>
                                {document.title}
                            </span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
            </CommandDialog>
            
    )
}