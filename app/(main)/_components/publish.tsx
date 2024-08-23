import React, { useState } from 'react'

import {Doc} from '@/convex/_generated/dataModel'
import { Popover,PopoverTrigger,PopoverContent} from '@/components/ui/popover'
import { useOrigin } from '@/hooks/use-origin'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Check, Copy, Globe } from 'lucide-react'

interface PublishProps{
    initialData:Doc<'documents'>
}
const Publish = ({initialData}:PublishProps) => {
    const origin = useOrigin()
    const updata = useMutation(api.documents.update)
    const [copied,setCopied] = useState(false)
    const [isSubmitting,setIsSubmitting] = useState(false)
    const url = `${origin}/preview/${initialData._id}`
    const onPublish = () => {
        
        const promise = updata({
            id:initialData._id,
            isPulished:true
        }).finally(() => setIsSubmitting(false))
        
        toast.promise (promise, {
            loading: 'Creating a new publishing...',
            success: 'published',
            error: 'Failed to publish'
        })
    }

      const onUnpublish = () => {
        
        const promise = updata({
            id:initialData._id,
            isPulished:false
        }).finally(()=>setIsSubmitting(false))
        toast.promise (promise, {
            loading: ' unPublishing...',
            success: 'unpublished',
            error: 'Failed to unpublishe'
        })
      }
    
    const onCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(()=>setCopied(false),2000)
    }
  return (
    <Popover>
        <PopoverTrigger asChild>
              <Button size='sm' variant='ghost'>
                  Publish
                  {initialData.isPulished && (
                      <Globe
                        className=' text-sky-500 w-4 h-4 ml-2'
                  />)}
            </Button>
        </PopoverTrigger>
          <PopoverContent
              className=' w-72'
              align='end'
              alignOffset={8}
              forceMount
          >
              {initialData.isPulished ? (
                  <div className=' space-y-4'>
                      <div className=' flex items-center gap-x-2'>
                          <Globe className=' text-sky-500 animate-pulse h-4 w-4'/>
                          <p className=' text-sm font-medium text-sky-500 '>
                              This note is published
                          </p>
                      </div>
                      <div className=' flex items-center'>
                          <input
                              className=' flex-1 px-2 text-xs border
                               h-8 bg-muted truncate rounded-l-md'
                              value={url}
                              disabled
                          />
                          <Button
                            onClick={onCopy}
                            disabled={copied}
                            className=' h-8 rounded-l-none'
                          >
                              {copied?<Check className=' h-4 w-4'/>:<Copy className=' h-4 w-4'/>}
                          </Button>
                      </div>
                      <Button
                          size='sm'
                          className=' w-full text-xs'
                          disabled={isSubmitting}
                          onClick={onUnpublish}
                      >
                          Unpuhlish
                      </Button>
                  </div>
              ) : (
                      <div className=' flex flex-col items-center justify-center'>
                          <Globe
                            className=' h-8 w-8 text-muted-foreground mb-2'
                          />
                          <p className=' text-sm font-medium mb-2'>
                              Publish this note
                          </p>
                          <span className=' text-xs text-muted-foreground mb-4'>
                              Share your work with others
                              </span>
                          <Button
                            disabled = {isSubmitting}
                            onClick={onPublish}
                            className=' w-full text-xs'
                            size='sm'
                          >
                              Publish
                              </Button>
                      </div>
              )}
      </PopoverContent>
    </Popover>
  )
}

export default Publish
