import React from 'react'
import { render } from '@testing-library/react'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import type { RenderOptions } from '@testing-library/react'

// Create a root route for testing
export const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// Test router factory
export function createTestRouter(routes: Array<any>, initialLocation = '/') {
  const routeTree = rootRoute.addChildren(routes)

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialLocation],
    }),
  })

  return router
}

// Wrapper component for testing
interface RouterWrapperProps {
  children: React.ReactNode
  router: any
}

function RouterWrapper({ children, router }: RouterWrapperProps) {
  return <RouterProvider router={router}>{children}</RouterProvider>
}

// Custom render function with router
interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
  router?: any
  initialLocation?: string
  routes?: Array<any>
}

export function renderWithRouter(
  ui: React.ReactElement,
  {
    router,
    initialLocation = '/',
    routes = [],
    ...renderOptions
  }: RenderWithRouterOptions = {},
) {
  if (!router && routes.length > 0) {
    router = createTestRouter(routes, initialLocation)
  }

  if (!router) {
    throw new Error(
      'Router is required. Provide either a router or routes array.',
    )
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <RouterWrapper router={router}>{children}</RouterWrapper>
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    router,
  }
}
