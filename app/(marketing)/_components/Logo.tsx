import Image from 'next/image'
import { Poppins } from 'next/font/google'
import {cn} from '@/lib/utils'


const poppins = Poppins({
  weight: ['400','600'],
  subsets: ['latin'],
})

const Logo = () => {
  return (
    <div className=' hidden md:flex items-center gap-x-2'>
          <Image
              src='/cha-cloud-svgrepo-com.svg'
              alt='logo'
              height='40'
              width='40'
              className=' dark:hidden'
          />
            <Image
              src='/briefcase-svgrepo-com.svg'
              alt='logo'
              height='40'
              width='40'
              className='hidden dark:block'
          />
          <p className={cn(' font-semibold',poppins.className)}>
              Jotion
          </p>
    </div>
  )
}

export default Logo
