import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Spinner } from '@/components/spinner'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery } from 'convex/react'
import { Search, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const TrashBox = () => {
    const router = useRouter()
    const params = useParams()
    const documents = useQuery(api.documents.getTrash)
    const restore = useMutation(api.documents.restore)
    const remove = useMutation(api.documents.remove)
    const [search,setSearch] = useState('')
    const filteredDoc = documents?.filter((doc)=>{
        return doc.title.toLowerCase().includes(search.toLowerCase())
    })
    
    const onClick = (id:string)=>{
        router.push(`/documents/${id}`)
    }
    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<'documents'>
           
    ) => {
        event.stopPropagation()
        const promise = restore({ id: documentId })
            
        toast.promise(promise, {
            loading: 'restoring a new document...',
            success: ' document resotred!',
            error: 'Failed to restore a  document.'
        })
    }
        
    const onRemove = (
        documentId: Id<'documents'>
    ) => {
        const promise = remove({ id: documentId })
        toast.promise(promise, {
            loading: 'removing a new document...',
            success: ' document remoed!',
            error: 'Failed to remove a  document.'
        })
        if (params.documentId ===documentId) {
            router.push('/documents')
        }
    }
    if (documents ===undefined) {
        return (
            <div className=' h-full flex items-center justify-center p-4'>
            <Spinner size='lg'/>
            </div>
        )
    }
  return (
    <div className=' text-sm'>
        <div className=' flex items-center gap-x-1 p-2'>
              <Search className=' h-4 w-4'/>
              <Input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className=' h-7 px-2 focus-visible:ring-transparent bg-secondary'
                placeholder='Filter by page title...'
              />
        </div>
          <div className=' mt-2 px-1 pb-1'>
              <p className=' hidden last:block text-xs text-center text-muted-foreground pb-2'>
                  No documents found
              </p>
              {filteredDoc?.map((doc)=>{
                  return(
                    <div
                    role='button'
                      key={doc._id}
                      onClick={()=>onClick(doc._id)}
                          className=' flex w-full justify-between text-primary text-sm
                           items-center gap-x-2 hover:bg-primary/5 
                      cursor-pointer'
                    >
                        <span className=' pl-2 truncate'>
                            {doc.title}
                        </span>
                        <div className=' flex items-center gap-x-1'>
                            <div
                                onClick={(event)=>onRestore(event,doc._id)}
                                className=' text-xs text-primary/80 hover:underline flex'
                            >
                                <Undo className=' h-4 w-4 text-muted-foreground inline-block'/> Restore
                            </div>
                            <ConfirmModal onConfirm={()=>onRemove(doc._id) } label={'this is an undone action'}>
                                
                                <div
                                    className=' text-xs text-primary/80 hover:underline'
                                    >
                                    Remove
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                  )
              })}
          </div>
              
        </div>
  )
}

export default TrashBox
