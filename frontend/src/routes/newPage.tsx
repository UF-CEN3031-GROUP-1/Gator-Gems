import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
export const Route = createFileRoute('/newPage')({ component: App })
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import createClient from 'openapi-fetch'
import type { paths } from '../types/api'

function App() {
	const client = createClient<paths>({
		baseUrl: 'http://localhost:8000',
	})
	const [email, setEmail] = useState("")
	const [finalEmail, setFinalEmail] = useState("")
	const queryClient = new QueryClient()
	const { data, isPending, isError } = useQuery({
		queryKey: ['user', finalEmail],
		queryFn: async () => {
			const { data, response } = await client.GET('/users/{email_address}', { params: { path: { email_address: finalEmail } } })
			if (data) { return data }
			else { throw new Error(response?.status.toString()) }
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
							setFinalEmail(e.target.value);
							setEmail(e.target.value);
						}}
						placeholder="Enter email"
					/>

					{isPending && <div>Loading...</div>}
					{isError && <div>Error fetching data</div>}
					{data && (
						<div>
							<h1>{data.firstName}</h1>
							<p>{data.lastName}</p>
						</div>)}
				</div>
			</QueryClientProvider></>)
}
