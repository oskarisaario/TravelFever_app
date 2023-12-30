import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import Map, { Marker, Popup } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { format } from 'timeago.js';





export default function Mapping() {
  const { currentUser } = useSelector((state) => state.user)
  const [cursorLocation, setCursorLocation] = useState(null);
  const [userPins, setUserPins] = useState([]);
  const [showUserPinsMenu, setShowUserPinsMenu] = useState(false);

  const [pinToUpdate, setPinToUpdate] = useState(null);
  const [pins, setPins] = useState([]);
  const [rating, setRating] = useState(null);
  const [starHover, setStarHover] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 30,
    latitude: 47,
    zoom: 3
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
    const latitude = e.lngLat.lat;
    const longitude = e.lngLat.lng
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


  return (
    <div>
      {/* SETUP MAP, MARKER, POPUP */}
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        {...viewState}
        style={{width: "100vw", height: "94vh"}}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onDblClick={handleAddClick}
        position='relative'
      >  
      {pins.map((p) => (
      <Marker 
        key={p._id}
        latitude={p.lat}
        longitude={p.long}
        offsetLeft={-viewState.zoom * 3.5}
        offsetTop={-viewState.zoom * 7}
      >
        <div>
          <FaMapMarkerAlt 
            className={currentUser._id === p.userRef ?'text-orange-500' : 'text-green-500'}
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
          className='bg-orange-300 rounded-lg p-3 m-3 font-semibold uppercase hover:opacity-90'
        >
          {!showUserPinsMenu ? 'My pins' : 'Close'}
        </button>
          {userPins && showUserPinsMenu && userPins.length > 0 && (
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
          )} : {userPins.length === 0 && showUserPinsMenu &&(
            <div 
              className='flex flex-col bg-orange-100 p-3 border-2 border-orange-300 gap-4 rounded-lg font-semibold' 
              style={{position: 'absolute', top: '65px', left: '12px'}}
              >No Pins Added yet
            </div>
          )} : {pinToUpdate && showUserPinsMenu && (
            <div 
              style={{position: 'absolute', top: '65px', left: '300px'}}
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
      </Map>    
    </div>
  );
}
