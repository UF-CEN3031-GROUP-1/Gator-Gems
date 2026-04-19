/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import EditReviewModal from '../../components/EditReviewModal'

const mutateMock = vi.fn()
let isPending = false

vi.mock('../../api/UpdateReviewMutation', () => ({
  useUpdateReviewMutation: (id: number, onClose: any, setError: any) => ({
    mutate: mutateMock,
    isPending,
  }),
}))

describe('EditReviewModal', () => {
  beforeEach(() => {
    mutateMock.mockReset()
    isPending = false
  })

  const review = {
    id: 1,
    stars: 5,
    notes: 'foo',
    visitAgain: false,
    address: 'Addr',
  }

  it('submits changes when form submitted', () => {
    render(<EditReviewModal review={review as any} onClose={() => {}} />)

    const notes = screen.getByLabelText(/notes/i)
    const button = screen.getByRole('button', { name: /save changes/i })

    fireEvent.change(notes, { target: { value: 'updated' } })
    fireEvent.click(button)

    expect(mutateMock).toHaveBeenCalled()
  })

  it('disables inputs and shows saving text when pending', () => {
    isPending = true
    render(<EditReviewModal review={review as any} onClose={() => {}} />)

    const button = screen.getByRole('button', { name: /saving/i })
    const form = button.closest('form') as HTMLFormElement
    const utils = within(form)

    const notes = utils.getByLabelText(/notes/i)
    expect(notes).toBeDisabled()
    expect(button).toBeDisabled()
  })
})
