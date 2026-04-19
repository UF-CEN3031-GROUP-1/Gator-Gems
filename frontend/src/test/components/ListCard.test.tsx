/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListCard from '../../components/ListCard'

vi.mock('@mui/material', () => ({
  __esModule: true,
  default: {},
  Card: (props: any) => <div {...props} />,
  CardMedia: (props: any) => <div {...props} />,
  CardContent: (props: any) => <div {...props} />,
  CardActions: (props: any) => <div {...props} />,
  Button: (props: any) => <a {...props} />,
  Typography: (props: any) => <div {...props} />,
}))

describe('ListCard', () => {
  it('renders title, description and link', () => {
    render(
      <ListCard
        image="/img.png"
        title="T"
        description="D"
        buttonUrl="https://example.com"
      />,
    )

    expect(screen.getByText('T')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /show map/i })
    expect(link).toHaveAttribute('href', 'https://example.com')
  })
})
