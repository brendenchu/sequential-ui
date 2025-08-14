// Main manager
export { SequentialManager } from './managers/SequentialManager.js'

// Navigation utilities
export { NavigationManager } from './utils/navigation.js'

// Types
export type {
  SequentialDirection,
  SequentialPanelDefinition,
  SequentialNavigationEvent,
  SequentialNavigationManager,
  SequentialEventHandlers,
  SequentialManagerOptions,
  SequentialConfig,
} from './types/index.js'

/**
 * Version information
 */
export const version = '0.1.0'

/**
 * Package metadata
 */
export const metadata = {
  name: '@sequential-ui/core',
  version,
  description: 'Framework-agnostic core logic for sequential UI components',
  keywords: ['sequential', 'wizard', 'stepper', 'multi-step', 'typescript', 'framework-agnostic'],
  author: 'Brenden Chu',
  license: 'MIT',
}
