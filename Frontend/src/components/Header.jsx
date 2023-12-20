import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className='bg-orange-300 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-semibold text-sm sm:text-4xl flex flex-wrap'>
            <span className='text-orange-600'>Travel</span>
            <span className='text-white'>Fever</span>
          </h1>
        </Link>
        <form className='bg-gray-200 p-3 rounded-lg flex items-center'>
          <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
          <button>
            <FaSearch className='text-orange-600'/>
          </button>
        </form>
        <ul className='flex gap-4 p-3 mr-2'>
          <Link to='/'>
            <li className='hidden sm:inline text-orange-600 font-semibold hover:underline'>Home</li>
          </Link>
          <Link to='/profile'>
          {currentUser ? (
            <img src={currentUser.avatar} alt='profile' className='rounded-full h-7 w-7 object-cover' />
          ):(
            <li className=' text-orange-600 font-semibold hover:underline'>SignIn</li>
          )}           
          </Link>
        </ul>
      </div>
    </header>
  )
}
