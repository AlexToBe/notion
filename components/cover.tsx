"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import { Button } from "./ui/button"
import { ImageIcon, X } from "lucide-react"
import { useCoverImage } from "@/hooks/use-cover-image"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useEdgeStore } from "@/lib/edgestore"

interface CoverProps{
    url?: string
    preview?:boolean
}


const Cover = ({url,preview}:CoverProps) => {
    const coverImage = useCoverImage()
  const params = useParams();
   const {edgestore} = useEdgeStore()
    const removeCover = useMutation(api.documents.removeCover)
    const onRemoveCover = async() => {
       if (url) {
           await edgestore.publicFiles.delete({
            url:url
        })
       }
        removeCover({id:params.documentId as Id<'documents'>})
    }
  return (
      <div className={cn(' relative w-full h-[35vh] group',
          !url && 'h-[12vh]',
          url&&'bg-muted'
        )}>
      {!!url && (
          <Image
              src={url}
              alt="cover"
              fill
              className={cn(
                  ' object-cover w-full h-full transition-all duration-500',
                  preview ? 'group-hover:scale-105' : 'scale-100'
              )}
          />
          )}
          {url && !preview && (
              <div className=" opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                  <Button
                  onClick={()=>coverImage.onReplace(url)}
                  className=" text-muted-foreground"
                  >
                      <ImageIcon className=" h-4 w-4 mr-2"/>
                      Change cover
                  </Button>
                   <Button
                  onClick={onRemoveCover}
                  className=" text-muted-foreground"
                  >
                      <X className=" h-4 w-4 mr-2"/>
                      remove
                  </Button>
              </div>
          )}
    </div>
  )
}

export default Cover
