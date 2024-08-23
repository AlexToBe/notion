'use client'
import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { UserItem } from "./user-item"
import { useMutation } from "convex/react"
import { toast } from 'sonner'
import { Popover,PopoverTrigger,PopoverContent} from '@/components/ui/popover'
import { api } from "@/convex/_generated/api"
import Item from "./item"
import DocumentList from "./document-list"
import TrashBox from "./trash-box"
import { useSearch } from "@/hooks/use-search"
import { useSetting } from "@/hooks/use-settings"
import Navbar from "./navbar"
export const Navigation = () => {

    const router = useRouter()
    const search = useSearch()
    const settings = useSetting()
    const isMobileScreen = useMediaQuery('(max-width: 768px)')
    const pathname = usePathname()
    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'div'>>(null)
    const [isResetting,setIsResetting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobileScreen)
    const params = useParams()
    const create = useMutation(api.documents.create)

    const onCreate = (event:React.MouseEvent<HTMLDivElement,MouseEvent>) => {
        event.stopPropagation()
      const promise = create({ title: 'Untitled' })
          .then((documentId) => {
              router.push(`/documents/${documentId}`)
          })
    toast.promise (promise, {
      loading: 'Creating a new document...',
      success: 'New document created!',
      error: 'Failed to create a new document.'
    })
   
  } 
    
    
   useEffect(() => {
       if (isMobileScreen) {
           collapse()
       } else {
           resetWith()
       }
   }, [isMobileScreen])
    
     useEffect(() => {
       if (isMobileScreen) {
           collapse()
       } 
   }, [isMobileScreen,pathname])
    const handleMouseDown = (event:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        event.preventDefault()
        event.stopPropagation()
        isResizingRef.current = true
    
      
        
        document.addEventListener('mousemove',onMouseMove)
        document.addEventListener('mouseup',onMouseUp)
        
    }
    const onMouseMove = (event:MouseEvent) => {
            if (!isResizingRef.current) {
                return
            }
            let newWidth = event.clientX 
            if (newWidth < 240) {
                newWidth = 240
            }
            if (newWidth > window.innerWidth - 240) {
                newWidth = window.innerWidth - 240
            }
            if (sidebarRef.current &&navbarRef.current) {
                sidebarRef.current.style.width = `${newWidth}px`
                navbarRef.current.style.setProperty('left', `${newWidth}px`)
                navbarRef.current.style.setProperty('width', `calc(100%-${newWidth})`)
            }
        }
    const onMouseUp = () => {
        isResizingRef.current = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
    }

    const resetWith = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false)
            setIsResetting(true)
       
        sidebarRef.current.style.width = isMobileScreen ? '100%' : '240px'  
        navbarRef.current.style.setProperty('width', isMobileScreen ? '0' : "calc(100%-240px)")
        navbarRef.current.style.setProperty('left', isMobileScreen ? '100%' : "240px")
        setTimeout(() => {
            setIsResetting(false)
        }, 300)
        }

    }


    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true)
            setIsResetting(true)
       
        sidebarRef.current.style.width = '0'  
        navbarRef.current.style.setProperty('width', "100%")
        navbarRef.current.style.setProperty('left', "0")
        setTimeout(() => {
            setIsResetting(false)
        }, 300)
        }

    }       

  return (
    <>
          <aside
              ref={sidebarRef}
              className={
                  cn(
                      "group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[9999]",
                      isResetting&&' transition-all ease-in-out duration-300',
                      isMobileScreen&&'w-0'
                  )}>
              <div
                  role="button"
                  onClick={collapse}
                  className={cn(
                    " h-6 w-6 text-muted-foreground  rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                      isMobileScreen&&' opacity-100'
               
                )}
              >
                  <ChevronsLeft className=" h-6 w-6"/>
            </div>
            <div>
                  <UserItem />
                  <Item
                      label="Search"
                      icon={Search}
                      isSearch
                      onClick={search.onOpen}
                  />
                    <Item
                      label="Settings"
                      icon={Settings}
                      onClick={settings.onOpen}
                  />
                  <Item onClick={onCreate} label = 'new page' icon ={PlusCircle}/>
            </div>
              <div className=" mt-4">
                  <DocumentList />
                  <Item
                      onClick={onCreate}
                      icon={Plus}
                      label="Add a page"
                  />
                  <Popover>
                      <PopoverTrigger className=" w-full mt-4">
                          <Item
                              label="Trash"
                              icon={Trash}
                          />
                      </PopoverTrigger>
                      <PopoverContent
                          className="p-0 w-72"
                          side={isMobileScreen ? 'bottom' : 'right'}>
                          <TrashBox/>
                      </PopoverContent>
                  </Popover>
            </div>
              <div
              className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
              onMouseDown={handleMouseDown}
                  onClick={resetWith}
              />
        </aside>
          <div
              ref={navbarRef}
              className={cn(
                  'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
                      isResetting&&' transition-all ease-in-out duration-300',
                      isMobileScreen&&'left-0 w-full'
              )}
          >
              {!!params.documentId ? (
                  <Navbar
                    isCollapsed={isCollapsed}
                    onResetWidth = {resetWith}
                  />
              ) : (
                      
                  <nav className=" bg-transparent px-3 py-3 w-full">
                  {isCollapsed&&<MenuIcon onClick={resetWith} className=" h-6 w-6 text-muted-foreground" role="button"/>}
              </nav>
            )}
        </div>
    </>
  )
}

