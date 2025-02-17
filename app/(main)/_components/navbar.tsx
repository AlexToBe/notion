'use client'

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import {  MenuIcon } from "lucide-react"
import { useParams } from "next/navigation"
import Title from "./title"
import Banner from "./banner"
import Menu from "./menu"
import Publish from "./publish"
interface NavbarProps{
    isCollapsed: boolean 
    onResetWidth:()=>void
}

const Navbar = ({isCollapsed, onResetWidth}:NavbarProps) => {
    const params = useParams()
    const document = useQuery(api.documents.getById, {
        id:params.documentId as Id<'documents'>
    })
    if (document ===undefined) {
        return <p></p>
    }
    if (document ===null) {
        return <p>not found</p>
    }
  return (
    <>
        <nav className=" bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex
           items-center gap-x-4">
              {isCollapsed && (
                  <MenuIcon
                      role="button"
                      onClick={onResetWidth}
                      className="h-6 w-6 text-muted-foreground"
                  />
              )}
              <div className=" flex items-center justify-between w-full">
                  <Title initialData={document} />
                  {!document.isArchived &&(
                  <div className=" flex items-center gap-x-2">
                          <Publish initialData={document} />
                      <Menu documentId={ document._id} />
                      </div>
                      )}
            </div>
      </nav>
          {document.isArchived && (
              <Banner documentId={document._id} />
        //   <div className=" bg-yellow-500/10 text-yellow-500 text-sm p-3 rounded-md">
        //       This document is archived
        //   </div>
      )}
    </>
  )
}

export default Navbar
