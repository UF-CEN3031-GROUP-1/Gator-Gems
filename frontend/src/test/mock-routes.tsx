import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router-utils'

export const createMockRoute = (
  path: string,
  component: React.ComponentType,
  options: any = {},
) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component,
    ...options,
  })
}

// Common test components
export function TestComponent({ title = 'Test' }: { title?: string }) {
  return <div data-testid="test-component">{title}</div>
}

export function LoadingComponent() {
  return <div data-testid="loading">Loading...</div>
}

export function ErrorComponent({ error }: { error: Error }) {
  return <div data-testid="error">Error: {error.message}</div>
}
