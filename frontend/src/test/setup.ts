import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// @ts-expect-error
global.IS_REACT_ACT_ENVIRONMENT = true
