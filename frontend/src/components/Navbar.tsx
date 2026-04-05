import '../styles/navbar.css'
import { useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useLogoutMutation } from '../api/LogoutMutation'
import { useUserQuery } from '../api/UserQuery'

export const Navbar = () => {
  const [error, setError] = useState<string | null>(null)
  const { data: user, isPending, isError } = useUserQuery()
  const logoutMutation = useLogoutMutation(setError)
  const handleClick = () => {
    logoutMutation.mutate()
  }
  const location = useLocation({ select: (location) => location.pathname })

  const displayNavbarButtons = () => {
    if (
      location === '/login' ||
      location === '/signup' ||
      (!user && !isPending)
    ) {
      return 'loginsignup'
    } else if (user) {
      return 'profilelogout'
    }
  }
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          Gator Gems
        </a>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li>
            <a href="/gemMap">Gem Map</a>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <ul className="nav-links">
          {displayNavbarButtons() == 'loginsignup' && (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
            </>
          )}
          {displayNavbarButtons() == 'profilelogout' && (
            <>
              <li>
                <a href="/profile"> Profile </a>
              </li>
              <li>
                <a href="/login" onClick={handleClick}>
                  {' '}
                  Logout{' '}
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
