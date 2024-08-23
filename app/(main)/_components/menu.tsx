import { Id } from '@/convex/_generated/dataModel'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
 } from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Trash } from 'lucide-react'
 
 
interface MenuProps{
    documentId:Id<'documents'>
}

const Menu  = ({documentId}:MenuProps) => {
    const router = useRouter()
    const { user } = useUser()
    const archive = useMutation(api.documents.archive)
    const onArchive = (
     ) => {
            const promise = archive({ id: documentId })
            toast.promise(promise, {
            loading: 'removing a new document...',
            success: ' document remoed!',
            error: 'Failed to remove a  document.'
        })
       router.push('/documents')
      }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
              <Button
                  size='sm'
                  variant='ghost'
              >
           <MoreHorizontal/>       
        </Button>
      </DropdownMenuTrigger>
          <DropdownMenuContent
            className=' w-60'
            alignOffset={8}
            forceMount
            align='end'
          >
              <DropdownMenuItem onClick={onArchive}>
                  <Trash className=' h-4 w-4 mr-2' />
                  Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <div className=' text-xs text-muted-foreground p-2' >
                  Last edited by:{user?.username}
              </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Menu 
