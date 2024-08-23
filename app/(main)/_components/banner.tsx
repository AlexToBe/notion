import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
interface BannerProps{
    documentId:Id<'documents'>
}

const Banner = ({documentId}:BannerProps) => {
    const router = useRouter()
    const remove = useMutation(api.documents.remove)
    const restore = useMutation(api.documents.restore)
    
    
      const onRemove = (
    ) => {
          const promise = remove({ id: documentId })
        toast.promise(promise, {
            loading: 'removing a new document...',
            success: ' document remoed!',
            error: 'Failed to remove a  document.'
        })
       router.push('/documents')
      }
      const onRestore = (
    
    ) => {
        const promise = restore({ id: documentId })
            
        toast.promise(promise, {
            loading: 'restoring a new document...',
            success: ' document resotred!',
            error: 'Failed to restore a  document.'
        })
    }
    
  return (
    <div className=' w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-start'>
      <p>This page is in the trash</p>
          <Button
              onClick={onRestore}
              variant='outline'
              size='sm'
              className=' border-white bg-transparent hover:bg-primary/50 text-white hover:text-white
               p-1 px-2 h-auto font-normal'
          >
              Restore
          </Button>
          <ConfirmModal label='this is an undong action!' onConfirm={onRemove}>
              
                <Button
                variant='ghost'
                size='sm'
                className=' border-white bg-transparent hover:bg-primary/50 text-white hover:text-white
                p-1 px-2 h-auto font-normal'
                >
                Delete
            </Button>
            </ConfirmModal>
    </div>
  )
}

export default Banner
