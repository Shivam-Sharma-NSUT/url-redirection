import Link from 'next/link'

const HomeButton = () => {
  return (
    <div className='px-4 py-2 rounded-full hover:bg-white'><Link href='/dashboard'>Home</Link></div>
  )
}

export default HomeButton;