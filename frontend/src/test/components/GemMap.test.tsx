import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { createRoute } from '@tanstack/react-router'
import { TestComponent, renderWithRouter, rootRoute } from '../router-utils'

describe('Code-Based Route Component Testing', () => {
  it('should render route component', () => {
    const testRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: TestComponent,
    })

    renderWithRouter(<div />, {
      routes: [testRoute],
      initialLocation: '/',
    })

    expect(screen.getByTestId('test-component')).toBeInTheDocument()
  })

  it('should render component with props from route context', () => {
    function ComponentWithContext() {
      const { title } = Route.useLoaderData()
      return <div data-testid="context-component">{title}</div>
    }

    const contextRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/context',
      component: ComponentWithContext,
      loader: () => ({ title: 'From Context' }),
    })

    renderWithRouter(<div />, {
      routes: [contextRoute],
      initialLocation: '/context',
    })

    expect(screen.getByText('From Context')).toBeInTheDocument()
  })
})
