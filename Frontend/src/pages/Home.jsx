import SignIn from './SignIn'


export default function Home() {
  return (
    <div>
        <div
          className='bg-[url("https://images.pexels.com/photos/8828584/pexels-photo-8828584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")] w-full bg-cover h-[250px] bg-center bg-no-repeat mb-8 md:h-[500px]'
        >       
        <h1 className='text-white p-3 font-bold text-3xl lg:text-6xl'>
          <span className='text-orange-600'> Sign in </span>
          and add
          <br/>
          all the places you have
          
          <span className='text-orange-600'> traveled</span><br/>
          <span>to the <span className='text-orange-600'>map</span> with description and ranking</span><br/>
          <span>and conquer the whole <span className='text-orange-600'>world</span>!</span>
        </h1>
        <div className='text-white p-3 font-bold text-xl lg:text-2xl'>If you want, you can 
          <span className='text-white'> share</span>
          <span> your visited </span>
          <br/>
          <span>places with others and </span>
          <span className='text-white'>see</span>
          <br/>
          <span> their places </span>
          <span className='text-orange-600'>too</span>
          <span>!</span>
        </div>
        </div>
      <SignIn />
    </div>
  )
}
