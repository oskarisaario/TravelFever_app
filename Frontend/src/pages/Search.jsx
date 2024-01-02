import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import { format } from 'timeago.js';

export default function Search() {
  const navigate = useNavigate();
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    const fetchPins = async () => {
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/pin/searchPins/get?${searchQuery}`);
      const data = await res.json();
      setPins(data);
    };

    fetchPins();
  }, [location.search]);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='font-semibold text-orange-600 text-2xl'>Search results</h1>
      <div className='flex flex-col md:flex-wrap'>
      {pins.map((pin) => (
        <div className='flex flex-col gap-2 border border-orange-300 p-2 m-2 hover:shadow-lg transition-shadow shadow-md' key={pin._id}>
          <label className=' text-lg text-orange-600 w-auto'>Place</label>
          <h4 className='text-base'>{pin.title}</h4>
          <label className=' text-lg text-orange-600'>Description</label>
          <p className='text-base'>{pin.description}</p>
          <label className=' text-lg text-orange-600'>Rating</label>
          <div className='flex'>
            {              
              Array(pin.rating).fill(true).map((item, index) => (<FaStar key={index} className='text-yellow-400 text-lg' />))          
            }
          </div>
          <label className='text-lg text-orange-600'>Created by</label>
          <p className='text-base'>{pin.username}</p>
          <p>{format(pin.createdAt)}</p>
        </div>
      ))}
      </div>
    </div>
  )
}
