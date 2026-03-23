import { createFileRoute } from '@tanstack/react-router'
import gatorBg from 'public/GainesvilleDownTown.jpg'

export const Route = createFileRoute('/login')({ component: App })

function App() {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${gatorBg})` }}
    >
      <div className="dark:bg-gray-800/95 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="px-2 py-1 w-full rounded-sm border border-gray-500/20 bg-white dark:bg-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[rgb(2,48,32)] text-white rounded-sm py-2 font-black uppercase"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
