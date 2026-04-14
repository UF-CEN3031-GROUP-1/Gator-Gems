import { createFileRoute } from '@tanstack/react-router'
import '../styles/front.css'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="bg">
      <div className="be">
        <h1 className="title">Welcome</h1>
        <p className="text">
          Gator Gems is a state of the art application that takes advantage of user submitted hidden gems all around
          Gainesville as to provide the best places for old and new Gainsville citizens to gain a new experience in the city.
        </p>

        <div className="actions">
          <button onClick={() => window.location.href = "/gemMap"} className="explore-button">Explore the Map</button>
          <button onClick={() => window.location.href = "/signup"} className="gt-button">Get Started</button>
        </div>

        <div className="row">
          <div className="item">
            <h3>Discover</h3>
            <p>Find unique local spots.</p>
          </div>
          <div className="item">
            <h3>Save</h3>
            <p>Keep your favorite places.</p>
          </div>
          <div className="item">
            <h3>Share</h3>
            <p>Help others explore Gainesville.</p>
          </div>
        </div>
      </div>
    </div>
     
  )
}

