import Logout from '@/components/auth/Logout'
import { Toaster } from '@/components/ui/toaster'
import HomeButton from './HomeButton';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className='border-2 w-full h-20 bg-slate-300 sticky top-0 flex items-center p-4 justify-between'>
          <div className='flex gap-2'>
            <HomeButton />
          </div>
          <div className='px-4'>
            <Logout className='px-4 py-2 rounded-full hover:bg-white' />
          </div>
      </header>
      {children}
      <Toaster />
    </div>
  )
}

export default Layout