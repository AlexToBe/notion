'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader
} from '@/components/ui/dialog'
import { useSetting } from '@/hooks/use-settings'
import { ModeToggle } from '../mode-toggle'
import { Label } from '@/components/ui/label'



export const SettingModal = () => {
    const settings = useSetting()

    
  return (
    <div>
          <Dialog open={settings.isOpen } onOpenChange={settings.onClose}>
          
              <DialogContent className='border-b pb-3'>
                  <DialogHeader>
                      <h2 className=' text-lg font-semibold'>
                          My settings
                      </h2>

                  </DialogHeader>
                  <div className=' flex items-center justify-between'>
                      <div className=' flex flex-col gap-y-1'>
                          <Label>
                              Apperance
                          </Label>
                          <span className=' text-[0.8rem] text-muted-foreground '>
                              Customize how Jotion looks on you device
                                

                          </span>
                      </div>
                      <ModeToggle/>
                      
                </div>
            </DialogContent>
      </Dialog>
    </div>
  )
}

