import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import SearchMap from '../components/SearchMap';

export default function Search() {
  const { state } = useLocation();
  const [pins, setPins] = useState([]);
  const [goToPin, setGoToPin] = useState({});
  const [notFound, setNotFound] = useState(false);



  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    setGoToPin({})

    const fetchPins = async () => {
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/pin/searchPins/get?${searchQuery}`);
        const data = await res.json();
        setPins(data);
        if(data.length === 0) {
          setNotFound(true);
          return;
        }
        setNotFound(false);
      }catch(error) {
        console.log(error)
      }
      };

    fetchPins();
  }, [state]);




  return (
    <div className='mx-auto'>
      <div className='flex flex-col h-screen md:flex-row'>
      <div className='flex flex-1 flex-col mr-2 ml-3 mb-2 md:gap-2 flex-grow overflow-y-auto relative min-h-[300px] md:h-screen'>
      <h1 className='font-semibold text-orange-600 text-2xl'>Search results:</h1>
      {pins.map((pin) => (      
        <div 
          key={pin._id} 
          className='gap-2 border border-orange-300 min-h-[70px] md:p-2 mr-2 hover:shadow-lg transition-shadow shadow-md truncate bg-orange-50 hover:cursor-pointer'
          onClick={() => setGoToPin({lat:pin.lat, long:pin.long, id: pin._id})}
        >
            <div className=' text-lg text-orange-600 w-auto'>Place: 
              <span className='text-base'> {pin.title}</span>
            </div>
            <div className='flex items-center text-lg text-orange-600'>
              Rating:
              {              
                Array(pin.rating).fill(true).map((item, index) => (<FaStar key={index} className='text-yellow-400 text-lg' />))          
              }
            </div>
        </div>
      ))}
      {notFound === true && (
        <p className='text-red-500 font-semibold text-lg'>Didnt find anything, please try again with different search term!</p>
      )}
      </div>
      <div className='flex-1 flex flex-col'>
        <SearchMap pins={pins} goToPin={{lat: goToPin.lat, long: goToPin.long, id: goToPin.id}}/>
      </div>
      </div>
    </div>
  )
}
