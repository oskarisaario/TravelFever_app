import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Map, { Marker, Popup } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { format } from 'timeago.js';
import { updateMapStyle } from '../redux/user/userSlice';


export default function SearchMap({pins, goToPin}) {
  const { currentUser, userMapStyle } = useSelector((state) => state.user);
  const [searchedPins, setSearchedPins] = useState([]);
  const dispatch = useDispatch();
  const [cursorLocation, setCursorLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState(userMapStyle || 'dark-v11');
  const [viewState, setViewState] = useState({
    longitude: 30,
    latitude: 27,
    zoom: 2.5,
  });
  
 

  useEffect(() => {
    setCursorLocation(null)
    
    if(pins) {
      setSearchedPins(pins);
    }
    if(goToPin.lat !== undefined) {
      handleMarkerClick(goToPin.id, goToPin.lat, goToPin.long)
      
    }
  },[goToPin])

  const handleMarkerClick = (id, lat, long) => {
    setViewState({ ...viewState, latitude: lat, longitude: long });
    setCursorLocation(id);
  };


  const handelMapStyleChange = (e) => {
    dispatch(updateMapStyle(e.target.value));
    setMapStyle(e.target.value)
  };

  
  return (
    <div className='flex mx-auto'>
      {/* SETUP MAP, MARKER, POPUP */}
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        {...viewState}
        style={{width: "70vw", height: "94vh"}}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
        position='relative'
      >
      {searchedPins.map((pin) => (
      <Marker 
        key={pin._id}
        latitude={pin.lat}
        longitude={pin.long}
        offsetLeft={-viewState.zoom * 3.5}
        offsetTop={-viewState.zoom * 7}
      >
        <div>
          <FaMapMarkerAlt 
            className={currentUser === null ? 'text-orange-500' : currentUser._id === pin.userRef ? `text-orange-500` : 'text-green-500'}
            style={{ fontSize: viewState.zoom * 7}}
            onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
          />
        </div>
        {cursorLocation === pin._id && (
        <Popup 
          latitude={pin.lat}
          longitude={pin.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCursorLocation(null)}
          anchor='left' >
            <div className='flex flex-col gap-2 w-[250px]'>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600 w-auto'>Place</label>
              <h4 className='text-base'>{pin.title}</h4>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Description</label>
              <p className='text-base'>{pin.description}</p>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Rating</label>
              <div className='flex'>
                {              
                  Array(pin.rating).fill(true).map((item, index) => (<FaStar key={index} className='text-yellow-400 text-lg' />))          
                }
              </div>
              <label className='border-b-2 border-b-orange-300 text-lg text-orange-600'>Created by</label>
              <p className='text-base'>{pin.username}</p>
              <p>{format(pin.createdAt)}</p>
            </div>
        </Popup>
        )}
      </Marker>
      ))}
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
      </Map>
    </div>
  )
}
