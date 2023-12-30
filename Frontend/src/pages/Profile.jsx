import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess } from '../redux/user/userSlice'

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [privateUser, setPrivateUser] = useState(currentUser.private);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);


  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
        setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      console.log('form', formData)
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      console.log(data)
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };


  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  
  const handlePrivateUser = () => {
    if (privateUser === false) {
      console.log('päälle')
      setPrivateUser(true);
      setFormData({ ...formData, ['private']: true });
    } else {
      console.log('pois')
      setPrivateUser(false);
      setFormData({ ...formData, ['private']: false });
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  console.log('current',currentUser.private)
  console.log('privateUser', privateUser)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          onChange={(e) => setFile(e.target.files[0])} 
          type='file' 
          ref={fileRef} 
          hidden 
          accept='image/*'
        />
        <img 
          src={formData.avatar || currentUser.avatar} 
          alt='profile_picture' 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error on image upload (Image must be less than 2mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-orange-600'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image uploaded successfully!</span>
          ) : (
            ''
          )}
        </p>
        <input 
          defaultValue={currentUser.username} 
          type='text' 
          placeholder='Username' 
          id='username' 
          className='border p-3 rounded-lg' 
          onChange={handleChange}
        />
        <input 
          defaultValue={currentUser.email} 
          type='email' 
          placeholder='Email' 
          id='email' 
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input 
          type='password' 
          placeholder='Password' 
          id='password' 
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <label className="relative flex justify-between items-center group p-2 text-lg">
          Set Your profile to private <span className='text-sm'> (so others wont see your pins)</span>
          <input onChange={handlePrivateUser}
            readOnly
            id='private'
            type="checkbox" checked={privateUser}
            className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md cursor-pointer" />
          <span className="cursor-pointer w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-orange-300 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
        </label>
        <button 
          disabled={loading}
          className='bg-orange-300 rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80 font-semibold'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-4 text-center'>{error ? error : '' }</p>
      <p className='text-green-700 mt-4 text-center'>{updateSuccess ? 'User is updated succesfully!': ''}</p>
    </div>
  )
}
