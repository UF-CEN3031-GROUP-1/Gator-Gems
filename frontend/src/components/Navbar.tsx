import '../styles/navbar.css'

export const Navbar = () => {
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
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/signup">Sign Up</a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
