import React from 'react'

const Navbar = () => {
  return (

    <nav className="bg-blue-950 p-4 text-white flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <ul>
         <li className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <a href="/" className="hover:text-blue-300 font-bold">Home</a>
            <a href="#" className="hover:text-blue-300 font-bold">About</a>
            <a href="#" className="hover:text-blue-300 font-bold">Contact</a>
         </li>
        </ul>
        <div>
          <h1 className="text-xl font-bold"><img className='h-8 invert' src="./icons/password-pattern-svgrepo-com.svg" alt="LOGO" /></h1>
        </div>
    </nav>
  )
}

export default Navbar
