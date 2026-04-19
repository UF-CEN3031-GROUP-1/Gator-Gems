/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Navbar } from '../../components/Navbar'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  useLocation: () => '/',
}))

const logoutMock = vi.fn()

vi.mock('../../api/UserQuery', () => ({
  useUserQuery: () => ({ data: null, isPending: false, isError: false }),
}))

vi.mock('../../api/LogoutMutation', () => ({
  useLogoutMutation: () => ({ mutate: logoutMock }),
}))

describe('Navbar', () => {
  beforeEach(() => {
    logoutMock.mockReset()
  })

  it('shows Login and Sign Up links when no user', () => {
    render(<Navbar />)

    expect(screen.getByText(/login/i)).toBeInTheDocument()
    expect(screen.getByText(/sign up/i)).toBeInTheDocument()
  })
})
