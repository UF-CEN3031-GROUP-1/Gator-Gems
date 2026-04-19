/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import SignupForm from '../../components/SignupForm'

const mutateMock = vi.fn()
let isPendingValue = false

vi.mock('../../api/SignupMutation.tsx', () => ({
  useSignupMutation: (setError: any) => ({
    mutate: mutateMock,
    isPending: isPendingValue,
  }),
}))

describe('SignupForm', () => {
  beforeEach(() => {
    mutateMock.mockReset()
    isPendingValue = false
  })

  it('shows validation error when fields are empty', () => {
    render(<SignupForm />)

    const button = screen.getByRole('button', { name: /sign up/i })
    const form = button.closest('form') as HTMLFormElement
    const utils = within(form)

    fireEvent.submit(form)

    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
    expect(mutateMock).not.toHaveBeenCalled()
  })

  it('calls mutate with form data when fields are filled', () => {
    render(<SignupForm />)

    const firstName = screen.getByLabelText(/first name/i)
    const lastName = screen.getByLabelText(/last name/i)
    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/password/i)
    const button = screen.getByRole('button', { name: /sign up/i })
    const form = button.closest('form') as HTMLFormElement
    const utils = within(form)

    fireEvent.change(firstName, { target: { value: 'John' } })
    fireEvent.change(lastName, { target: { value: 'Doe' } })
    fireEvent.change(email, { target: { value: 'john@doe.com' } })
    fireEvent.change(password, { target: { value: 's3cret' } })

    fireEvent.click(button)

    expect(mutateMock).toHaveBeenCalledWith({
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 's3cret',
    })
  })
})
