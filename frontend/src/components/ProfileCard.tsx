import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import { useUserQuery } from '../api/UserQuery'
import MediaCard from './ListCard'

export default function ProfileCard() {
  const cardData = [
    {
      image: '/GainesvilleDownTown.jpg',
      title: 'THE GREATEST GEM IN THE UNIVERSE',
      description:
        'Why do you need a description when you got the greatest gem in the universe?',
      buttonUrl: '/gemMap',
    },
    {
      image: '/GainesvilleDownTown.jpg',
      title: 'THE GREATEST GEM IN THE UNIVERSE',
      description:
        'Why do you need a description when you got the greatest gem in the universe?',
      buttonUrl: '/gemMap',
    },
    {
      image: '/GainesvilleDownTown.jpg',
      title: 'THE GREATEST GEM IN THE UNIVERSE',
      description:
        'Why do you need a description when you got the greatest gem in the universe?',
      buttonUrl: '/gemMap',
    },
    {
      image: '/GainesvilleDownTown.jpg',
      title: 'THE GREATEST GEM IN THE UNIVERSE',
      description:
        'Why do you need a description when you got the greatest gem in the universe?',
      buttonUrl: '/gemMap',
    },
    {
      image: '/GainesvilleDownTown.jpg',
      title: 'THE GREATEST GEM IN THE UNIVERSE',
      description:
        'Why do you need a description when you got the greatest gem in the universe?',
      buttonUrl: '/gemMap',
    },
  ]
  const { data: user, isPending, isError } = useUserQuery()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-300">Loading profile...</p>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-400">
          Failed to load profile. Please log in again.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* User info header */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center text-3xl font-bold text-green-300">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-400 mt-1">{user.emailAddress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {/* Account details */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Account Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">
                First Name
              </p>
              <p className="text-white">{user.firstName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">
                Last Name
              </p>
              <p className="text-white">{user.lastName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">Email</p>
              <p className="text-white">{user.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Placeholder: My Gems */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">My Gems</h2>
          <Container maxWidth="lg" sx={{ py: 2 }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                overflowX: 'auto',
                py: 2.5,
              }}
            >
              {cardData.map((card) => (
                <MediaCard
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  buttonUrl={card.buttonUrl}
                />
              ))}
            </Stack>
          </Container>
        </div>

        {/* Placeholder: Activity */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 border-dashed opacity-60">
          <h2 className="text-lg font-semibold mb-2">Activity</h2>
          <p className="text-gray-500 text-sm">
            Coming soon — your recent activity will appear here.
          </p>
        </div>

        {/* Placeholder: Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 border-dashed opacity-60">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p className="text-gray-500 text-sm">
            Coming soon — account settings will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}
