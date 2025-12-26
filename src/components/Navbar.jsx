import React from 'react'
import { NavLinks } from '../constants'

const Navbar = () => {
  return (
    <header>
        <nav>
            <img src="/logo.svg" alt="Logo" />
            <ul>
                {NavLinks.map((label) => (
                    <li key={label.label}>
                        <a href={label.label}>{label.label}</a>
                    </li>
                ))
                }
            </ul>

            <div>
                <button>
                    <img src="/search.svg" alt="Search" />
                </button>
                <button>
                    <img src="/cart.svg" alt="Search" />
                </button>
            </div>
        </nav>
    </header>
  )
}

export default Navbar