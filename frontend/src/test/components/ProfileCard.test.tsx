/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import ProfileCard from '../../components/ProfileCard'

vi.mock('../../components/EditReviewModal', () => ({
  __esModule: true,
  default: ({ review }: any) => (
    <div data-testid="edit-modal">edit {review?.id}</div>
  ),
}))

vi.mock('../../api/UserQuery', () => ({
  useUserQuery: () => ({
    data: { firstName: 'John', lastName: 'Doe', emailAddress: 'a@b.com' },
    isPending: false,
    isError: false,
  }),
}))

vi.mock('../../api/MyReviewsQuery', () => ({
  useMyReviewsQuery: () => ({
    data: [
      { id: 1, address: '123 Main', stars: 7, notes: 'Nice', visitAgain: true },
    ],
  }),
}))

describe('ProfileCard', () => {
  it('renders user info and reviews and opens edit modal', () => {
    render(<ProfileCard />)

    expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    expect(screen.getByText(/123 Main/i)).toBeInTheDocument()

    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument()
  })
})
