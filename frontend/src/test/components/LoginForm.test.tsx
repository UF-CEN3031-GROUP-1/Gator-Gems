import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import LoginForm from '../../components/LoginForm'

const mutateMock = vi.fn()
let isPendingValue = false

vi.mock('../../api/LoginMutation.tsx', () => ({
  useLoginMutation: (email: string, password: string, setError: any) => ({
    mutate: mutateMock,
    isPending: isPendingValue,
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    mutateMock.mockReset()
    isPendingValue = false
  })

  it('calls mutate when form is submitted with values', () => {
    render(<LoginForm />)

    const email = screen.getByLabelText(/email/i)
    const password = screen.getByLabelText(/password/i)
    const button = screen.getByRole('button', { name: /login/i })

    fireEvent.change(email, { target: { value: 'a@b.com' } })
    fireEvent.change(password, { target: { value: 'pass' } })

    fireEvent.click(button)

    expect(mutateMock).toHaveBeenCalled()
  })

  it('disables inputs and shows loading text when mutation is pending', () => {
    isPendingValue = true
    render(<LoginForm />)

    const button = screen.getByRole('button', { name: /logging in/i })
    const form = button.closest('form') as HTMLFormElement
    const utils = within(form)

    const email = utils.getByLabelText(/email/i)
    const password = utils.getByLabelText(/password/i)

    expect(email).toBeDisabled()
    expect(password).toBeDisabled()
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent(/logging in/i)
  })
})
