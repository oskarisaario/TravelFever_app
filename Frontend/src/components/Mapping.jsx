import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Map, { Marker, Popup } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { format } from 'timeago.js';
import { updateMapStyle } from '../redux/user/userSlice';



export default function Mapping() {
  const { currentUser, userMapStyle } = useSelector((state) => state.user);
  const [userPins, setUserPins] = useState([]);
  const [pinsToView, setPinsToView] = useState([]);
  const [cursorLocation, setCursorLocation] = useState(null);
  const [showUserPinsMenu, setShowUserPinsMenu] = useState(false);
  const [mapStyle, setMapStyle] = useState(userMapStyle || 'dark-v11');
  const [pinToUpdate, setPinToUpdate] = useState(null);
  const [pins, setPins] = useState([]);
  const [userPinColor, setUserPinColor] = useState('text-orange-500');
  const [othersPinColor, setOthersPinColor] = useState('text-green-500');
  const [rating, setRating] = useState(null);
  const [starHover, setStarHover] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [onlyMyPins, setOnlyMypins] = useState(true);
  const dispatch = useDispatch();
  const [viewState, setViewState] = useState({
    longitude: 30,
    latitude: 27,
    zoom: 2.5,
  });
  
  
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await fetch(`/api/pin/getPins/${currentUser._id}`);
        const data = await res.json();
        setPins(data);
      } catch (error) {
        console.log(error)
      }
    }
    const getUserPins = async () => {
      try {
        const res = await fetch(`/api/user/pins/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message)
          return;
        }
        setUserPins(data);
        if (pinsToView.length === 0) {
          setPinsToView(data)
        }
      } catch (error) {
        console.log(error);
      }
    }
    getPins();
    getUserPins();
  }, [pins]);


  const handleMarkerClick = (id, lat, long) => {
    setCursorLocation(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  }


  const handleAddClick = (e) => {
    const latitude =  e.lngLat.lat;
    const longitude = e.lngLat.lng
    setViewState({ ...viewState, latitude, longitude});
    setNewPlace({
      lat: latitude,
      long: longitude
    })
  };


  const handleChange = (e) => {
    setNewPlace({
      ...newPlace,
      rating,
      [e.target.id]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      ...newPlace,
      rating,
      username: currentUser.username,
      userRef: currentUser._id,
      private: currentUser.private
    }
    try {
      const res = await fetch('/api/pin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPin),
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message)
          return;
        }
        setPins([...pins, data]);
        setNewPlace(null);
        setRating(0);
    } catch (error) {
      console.log(error.message);
    } 
  };

  const showUserPins = () => {
    if (!showUserPinsMenu) {
      setShowUserPinsMenu(true);
    } else {
      setShowUserPinsMenu(false);
    }
  };


  const handleDeletePin = async (id) => {
    try {
      const res = await fetch(`/api/pin/delete/${id}`,
      {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setPins((prev) => prev.filter((pin) => pin._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleUpdateChange = (e) => {
    setPinToUpdate({
      ...pinToUpdate,
      [e.target.id]: e.target.value
    });
  }


  const handleUpdatePin = async (e) => {
    e.preventDefault();
    const updatedPin = {
      ...pinToUpdate,
      rating: !rating ? pinToUpdate.rating : rating
    }
    try {
      const res = await fetch(`/api/pin/update/${pinToUpdate._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPin),
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message)
          return;
        }
        setRating(null);
        setPinToUpdate(null);
    } catch (error) {
      console.log(error.message);
      setRating(null);
      setPinToUpdate(null);
    }
  };

  
  const handelMapStyleChange = (e) => {
    dispatch(updateMapStyle(e.target.value));
    setMapStyle(e.target.value)
  };

  const handleViewPins = () => {
    if (onlyMyPins) {
      setOnlyMypins(false);
      setPinsToView(pins);
    } else {
      setOnlyMypins(true);
      setPinsToView(userPins)
    }
  };



  return (
    <div className='flex justify-between items-center mx-auto'>
      {/* SETUP MAP, MARKER, POPUP */}
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        {...viewState}
        style={{width: "100vw", height: "94vh"}}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
        onDblClick={handleAddClick}
        position='relative'
        doubleClickZoom = {false}
      > 
      {pinsToView.map((p) => (
      <Marker 
        key={p._id}
        latitude={p.lat}
        longitude={p.long}
        offsetLeft={-viewState.zoom * 3.5}
        offsetTop={-viewState.zoom * 7}
      >
        <div>
          <FaMapMarkerAlt 
            className={currentUser._id === p.userRef ? `${userPinColor}` : `${othersPinColor}`}
            style={{ fontSize: viewState.zoom * 7}}
            onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
          />
        </div>
        {cursorLocation === p._id && (
        <Popup 
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCursorLocation(null)}
          anchor='left' >
            <div className='flex flex-col gap-2 w-[250px]'>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600 w-auto'>Place</label>
              <h4 className='text-base'>{p.title}</h4>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Description</label>
              <p className='text-base'>{p.description}</p>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Rating</label>
              <div className='flex'>
                {              
                  Array(p.rating).fill(true).map((item, index) => (<FaStar key={index} className='text-yellow-400 text-lg' />))          
                }
              </div>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Created by</label>
              <p className='text-base'>{p.username}</p>
              <p>{format(p.createdAt)}</p>
            </div>
        </Popup>
        )}
      </Marker>
        ))}
        {/* SETUP NEW MARKER AND POPUP FOR INFO ABOUT THE NEW PLACE */}
        {newPlace && (
          <>
          <Marker 
            latitude={newPlace.lat}
            longitude={newPlace.long}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <FaMapMarkerAlt className='text-orange-500' style={{ fontSize: viewState.zoom * 7}} />
          </Marker>
          <Popup 
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor='left' 
          >
            <div>
              <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-[250px]'>
                <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Place</label>
                <input onChange={handleChange} className='text-base border-none p-2' placeholder='Place' id='title' maxLength='30' required />
                <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Description</label>
                <textarea onChange={handleChange} className='text-base p-2' type='text' placeholder='Description' id='description' required />
                <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Rating</label>
                <div className='flex'>
                  {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                      <span key={i}>
                        <FaStar
                          className='text-lg' 
                          color={ratingValue <= (starHover || rating) ? 'FFA500' : '#ccc'}
                          onMouseEnter={() => setStarHover(ratingValue)}
                          onMouseLeave={() => setStarHover(null)}
                          onClick={() => setRating(ratingValue)}
                        />
                      </span>
                    )
                  })}
                </div>
                <button className='bg-orange-300 rounded-lg uppercase p-2 font-semibold hover:opacity-90'>Add Pin</button>
              </form>
            </div>
        </Popup>
        </>
        )}
        {/* SETUP BUTTON FOR VIEWING USER PINS */}
        <button 
          onClick={showUserPins} 
          style={{position: 'absolute'}} 
          className=' bg-orange-300  rounded-lg p-2 m-3 font-semibold uppercase hover:opacity-90'
        >
          {!showUserPinsMenu ? 'My pins' : 'Close'}
        </button>
          {userPins && showUserPinsMenu && userPins.length > 0 && (
            <>
            <p style={{position: 'absolute', top: '12px', left: '85px'}} className='bg-orange-300 rounded-lg p-2 font-semibold text-sm '>You have visited {userPins.length} places!</p>
            <div className='flex flex-col bg-orange-100 p-3 border-2 border-orange-300 gap-4 rounded-lg' style={{position: 'absolute', top: '65px', left: '12px'}}>
              {userPins.map((pin) => (
                <div key={pin._id} className='flex border-b-2 border-b-orange-300 gap-2 justify-between'>
                  <div>
                    <p className='font-semibold mt-1'>{pin.title}</p>
                  </div>
                  <div className='font-semibold'>
                    <button 
                      onClick={() => handleDeletePin(pin._id)} 
                      className='bg-red-500 rounded-lg p-1 mb-2 ml-2 uppercase hover:opacity-90'
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => setPinToUpdate(pin)} 
                      className='bg-orange-300 rounded-lg p-1 md-2 ml-2 uppercase hover:opacity-90'                   
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </>
          )} : {userPins.length === 0 && showUserPinsMenu &&(
            <div 
              className='flex flex-col bg-orange-100 p-3 border-2 border-orange-300 gap-4 rounded-lg font-semibold' 
              style={{position: 'absolute', top: '65px', left: '12px'}}
              >No Pins Added yet
            </div>
          )} : {pinToUpdate && showUserPinsMenu && (
            <div 
              style={{position: 'absolute', top: '65px', left: '380px'}}
              className='flex flex-col bg-orange-100 p-3 border-2 border-orange-300 gap-4 rounded-lg'
            >
              <form onSubmit={handleUpdatePin} className='flex flex-col gap-2 w-[250px]'>
                <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Place</label> 
                <input 
                  onChange={handleUpdateChange} 
                  className='text-base border-none p-2' 
                  placeholder= {pinToUpdate.title} 
                  id='title' 
                  maxLength='30' 
                />
                <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Description</label>
                <textarea 
                  onChange={handleUpdateChange} 
                  className='text-base p-2' 
                  type='text' 
                  placeholder={pinToUpdate.description} 
                  id='description' 
                />
                <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Rating</label>
                <div className='flex'>
                  {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                      <span key={i}>
                        <FaStar
                          className='text-lg' 
                          color={ratingValue <= (starHover || rating) ? 'FFA500' : '#ccc'}
                          onMouseEnter={() => setStarHover(ratingValue)}
                          onMouseLeave={() => setStarHover(null)}
                          onClick={() => setRating(ratingValue)}
                        />
                      </span>
                    )
                  })}
                </div>
                <button 
                  onClick={handleUpdatePin}
                  className='bg-orange-300 rounded-lg uppercase p-2 font-semibold hover:opacity-90'
                >
                  Update Pin
                </button>
                <button 
                  type='button' 
                  onClick={() => {setPinToUpdate(null), setRating(null)}} 
                  className='bg-red-500 rounded-lg uppercase p-2 font-semibold hover:opacity-90'
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
          <label style={{position: 'absolute', bottom: '30px', left: '1px'}} className='bg-orange-300 rounded-lg p-2 m-3 font-semibold'>Your pin color:
            <select 
              value={userPinColor} 
              onChange={e => setUserPinColor(e.target.value)} 
              className=''
            >
              <option value='text-orange-500' className='bg-orange-500 text-black font-semibold' defaultValue='text-orange-500'>Orange</option>
              <option value='text-red-500' className='bg-red-800 text-black  font-semibold'>Red</option>
              <option value='text-green-500' className='bg-green-500 text-black  font-semibold'>Green</option>
              <option value='text-yellow-500' className='bg-yellow-200 text-black  font-semibold'>Yellow</option>
              <option value='text-blue-500' className='bg-blue-500 text-black  font-semibold'>Blue</option>
              <option value='text-pink-500' className='bg-pink-500 text-black  font-semibold'>Pink</option>
              <option value='text-black' className=' text-black  font-semibold'>Black</option>
            </select>
          </label>
          <label style={{position: 'absolute', right: '1px', bottom: '30px'}} className='bg-orange-300 rounded-lg p-2 m-3 font-semibold'>Others pin color:
            <select 
              value={othersPinColor} 
              onChange={e => setOthersPinColor(e.target.value)} 
              className=''
            >
              <option value='text-orange-500' className='bg-orange-500 text-black font-semibold'>Orange</option>
              <option value='text-red-500' className='bg-red-800 text-black  font-semibold'>Red</option>
              <option value='text-green-500' className='bg-green-500 text-black  font-semibold' defaultValue='text-green-500'>Green</option>
              <option value='text-yellow-500' className='bg-yellow-200 text-black  font-semibold'>Yellow</option>
              <option value='text-blue-500' className='bg-blue-500 text-black  font-semibold'>Blue</option>
              <option value='text-pink-500' className='bg-pink-500 text-black  font-semibold'>Pink</option>
              <option value='text-black' className=' text-black  font-semibold'>Black</option>
            </select>
          </label>
          <select 
            className='bg-orange-300 rounded-lg p-2 m-3 font-semibold hover:opacity-90' 
            style={{position: 'absolute', right: '1px'}}
            value={mapStyle}
            onChange={handelMapStyleChange}
            placeholder='Select map style'
          >
            <option className='font-semibold' value="none" disabled >Select map style</option>
            <option value='dark-v11' className='font-semibold'>Dark</option>
            <option value='light-v11' className='font-semibold'>Light</option>
            <option value='satellite-v9' className='font-semibold'>Satellite</option>
            <option value='streets-v12' className='font-semibold'>Streets</option>
            <option value='outdoors-v12' className='font-semibold'>Outdoors</option>
          </select>
          <span 
            style={{position: 'absolute', right: '150px', top: '15px'}} 
            className=' bg-orange-300 rounded-lg p-1 mr-2'>
          <label className='font-semibold'>Show only my pins</label>
          <input 
            type="checkbox" 
            style={{ verticalAlign: 'text-bottom' }} 
            className='ml-1 w-4 h-4 text-orange-500 accent-orange-600'
            onChange={handleViewPins}
            checked={onlyMyPins}
          />
          </span>
      </Map>    
    </div>
  );
}
