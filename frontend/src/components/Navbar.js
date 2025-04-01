import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const[activeLink, setActiveLink] = useState('home')

    return (
        <nav className="bg-navyBlue shadow-lg">

            <div className="max-w-7xl mx-auto px-4">

                <div className="flex justify-between items-center h-16">

                    <div className="flex items-center">
                        <Link to="/" onClick={() => setActiveLink('home')} className="text-white text-xl font-bold">
                            Campus Navigator
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/" onClick={() => setActiveLink('home')} className={`px-3 py-2 rounded-md transition-colors duration-200 ${activeLink === 'home' ? 'bg-lightBlue text-white' : 'text-skyBlue hover:text-white'}`}>
                            Home
                        </Link>

                        <Link to="/about" onClick={() => setActiveLink('about')} className={`px-3 py-2 rounded-md transition-colors duration-200 ${activeLink === 'about' ? 'bg-lightBlue text-white' : 'text-skyBlue hover:text-white'}`}>
                            About
                        </Link>
                    </div>

                </div>

            </div>

        </nav>
    )
}

export default Navbar
