import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch }  from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { signinSuccess } from '../redux/user/userSlice';


export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider)
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
      })
      const data = await res.json();
      dispatch(signinSuccess(data));
      navigate('/homemap');
    } catch (error) {
      console.log('Could not sign in with google', error)
    }
  }

  return (
    <button 
      type='button'
      onClick={handleGoogleClick}
      className='bg-orange-600 font-semibold rounded-lg uppercase p-3 hover:opacity-90'
    >
      Continue with Google
    </button>
  )
}
