import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signinSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const { error, loading } = useSelector((state) => state.user);

  
  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value,
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signinSuccess(data));
      navigate('/homemap');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input onChange={handleChange} type='text' placeholder='Username' id='username' className='border p-3 rounded-lg' required />
        <input onChange={handleChange} type='password' placeholder='Password' id='password' className='border p-3 rounded-lg' required />
        <button 
          disabled={loading}
          className='bg-orange-300 p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 font-semibold'
        > {loading ? 'Loading...' : 'Sign In!'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-2'>
        <p>No account yet?</p>
        <Link to={'/sign-up'}>
          <span className='text-orange-500 hover:underline'> Sign up here</span>
        </Link>
      </div>
      {error && <p className='text-red-500 text-center'>{error}</p>}
    </div>
  )
}

