/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ReviewForm from '../../components/ReviewForm'

const mutateMock = vi.fn()
let isPending = false

vi.mock('../../api/CreateReviewMutation', () => ({
  useCreateReviewMutation: (onClose: any, setError: any) => ({
    mutate: mutateMock,
    isPending,
  }),
}))

describe('ReviewForm', () => {
  beforeEach(() => {
    mutateMock.mockReset()
    isPending = false
  })

  it('calls mutate when form submitted with values', () => {
    render(<ReviewForm onClose={() => {}} />)

    const location = screen.getByLabelText(/location name/i)
    const notes = screen.getByLabelText(/notes/i)
    const button = screen.getByRole('button', { name: /add gem/i })

    fireEvent.change(location, { target: { value: 'Depot Park' } })
    fireEvent.change(notes, { target: { value: 'Nice place' } })
    fireEvent.click(button)

    expect(mutateMock).toHaveBeenCalled()
  })

  it('disables inputs when pending', () => {
    isPending = true
    render(<ReviewForm onClose={() => {}} />)

    const button = screen.getByRole('button', { name: /saving/i })
    expect(button).toBeDisabled()
  })
})
