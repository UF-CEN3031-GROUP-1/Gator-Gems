import { createFileRoute } from '@tanstack/react-router'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import createClient from 'openapi-fetch'
import type { paths } from '../types/api'

export const Route = createFileRoute('/newPage')({ component: App })

const queryClient = new QueryClient()

function App() {
  const client = createClient<paths>({
    baseUrl: 'http://localhost:8000',
  })
  const [email, setEmail] = useState('')
  const [finalEmail, setFinalEmail] = useState('')
  const {
    data: userData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['user', finalEmail],
    queryFn: async () => {
      const { data, response } = await client.GET('/users/{email_address}', {
        params: { path: { email_address: finalEmail } },
      })
      if (data) {
        return data
      } else {
        throw new Error(response.status.toString())
      }
    },
    staleTime: 1000 * 60,
    enabled: !!finalEmail,
  })

  return (
    <>
      <ReactQueryDevtools />
      <QueryClientProvider client={queryClient}>
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => {
              setFinalEmail(e.target.value)
              setEmail(e.target.value)
            }}
            placeholder="Enter email"
          />

          {isPending && <div>Loading...</div>}
          {isError && <div>Error fetching data</div>}
          {userData && (
            <div>
              <h1>{userData.firstName}</h1>
              <p>{userData.lastName}</p>
            </div>
          )}
        </div>
      </QueryClientProvider>
    </>
  )
}
