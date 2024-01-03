import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input onChange={handleChange} type='text' placeholder='Username' id='username' className='border p-3 rounded-lg' required minLength='3'/>
        <input onChange={handleChange} type='email' placeholder='Email' id='email' className='border p-3 rounded-lg' required/>
        <input onChange={handleChange} type='password' placeholder='Password' id='password' className='border p-3 rounded-lg' required minLength='6'/>
        <button 
          disabled={loading}
          className='bg-orange-300 p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 font-semibold'
        > {loading ? 'Loading...' : 'Sign Up!'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-2'>
        <p>Already have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-orange-500 hover:underline'> Sign in here</span>
        </Link>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}
