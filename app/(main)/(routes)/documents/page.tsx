

'use client'
import Image from 'next/image'
import { useUser } from '@clerk/clerk-react'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const DocumentsPage = () => {
  const { user } = useUser()
  const create = useMutation(api.documents.create)
  const router = useRouter()
  const onCreate = () => {
    const promise = create({ title: 'Untitled' })
    .then((id) => {
      router.push(`/documents/${id}`)
    })
    toast.promise (promise, {
      loading: 'Creating a new document...',
      success: 'New document created!',
      error: 'Failed to create a new document.'
    })
   
  } 


  return (
    <div className=" h-full flex flex-col items-center justify-center space-y-4">
      <Image
      alt=''
        src='/11.png'
        height='300'
        width='300'
      />

      <h2 className=' text-lg font-medium'>
          Welcome to {user?.username}&apos;s jotion
       
      </h2>
       <Button onClick={onCreate} >
        <PlusCircle className=' h-4 w-4 mr-2'/>
        Create a note
        </Button>
    </div>
  )
}

export default DocumentsPage
