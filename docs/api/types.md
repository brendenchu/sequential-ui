# TypeScript Types & Interfaces

Complete TypeScript type definitions for Sequential UI core functionality. All types are exported from `@sequential-ui/core` for comprehensive type safety.

## Import Types

```typescript
import type {
  SequentialDirection,
  SequentialPanelDefinition,
  SequentialNavigationEvent,
  SequentialNavigationManager,
  SequentialEventHandlers,
  SequentialManagerOptions,
  SequentialConfig
} from '@sequential-ui/core'
```

## Core Types

### `SequentialDirection`

Direction of sequential navigation transition.

```typescript
type SequentialDirection = 'next' | 'previous' | 'none'
```

**Usage:**
- `'next'` - Moving forward in the sequence
- `'previous'` - Moving backward in the sequence  
- `'none'` - Direct navigation (goTo) where direction is ambiguous

**Example:**
```typescript
function handleNavigation(direction: SequentialDirection) {
  switch (direction) {
    case 'next':
      console.log('Moving forward')
      break
    case 'previous':
      console.log('Moving backward')
      break
    case 'none':
      console.log('Direct navigation')
      break
  }
}
```

## Panel Definitions

### `SequentialPanelDefinition<T>`

Individual panel definition with optional validation and content.

```typescript
interface SequentialPanelDefinition<T = Record<string, unknown>> {
  id: string | number
  component?: unknown
  props?: T
  content?: () => unknown
  disabled?: boolean
  canNavigateFrom?: () => boolean | Promise<boolean>
  canNavigateTo?: () => boolean | Promise<boolean>
}
```

**Properties:**

#### `id: string | number`
Unique identifier for the panel. Used for tracking and reference.

```typescript
const panels: SequentialPanelDefinition[] = [
  { id: 'welcome' },
  { id: 'setup' },
  { id: 42 } // Numeric IDs also supported
]
```

#### `component?: unknown`
Framework-specific component reference. Type is `unknown` to maintain framework-agnostic core.

```typescript
// Vue example (would be typed in Vue package)
const panel: SequentialPanelDefinition = {
  id: 'signup-form',
  component: SignupFormComponent
}
```

#### `props?: T`
Type-safe props to pass to the component or content function.

```typescript
interface FormProps {
  title: string
  validation: boolean
}

const panel: SequentialPanelDefinition<FormProps> = {
  id: 'form',
  props: {
    title: 'User Registration',
    validation: true
  }
}
```

#### `content?: () => unknown`
Function that returns content for the panel.

```typescript
const panel: SequentialPanelDefinition = {
  id: 'dynamic',
  content: () => {
    return `Current time: ${new Date().toISOString()}`
  }
}
```

#### `disabled?: boolean`
Whether the panel is disabled and cannot be navigated to.

```typescript
const panel: SequentialPanelDefinition = {
  id: 'premium-feature',
  disabled: !user.hasPremium
}
```

#### `canNavigateFrom?: () => boolean | Promise<boolean>`
Validation function called before leaving this panel.

```typescript
const panel: SequentialPanelDefinition = {
  id: 'form-step',
  canNavigateFrom: async () => {
    const formData = getFormData()
    return await validateForm(formData)
  }
}
```

#### `canNavigateTo?: () => boolean | Promise<boolean>`
Validation function called before entering this panel.

```typescript
const panel: SequentialPanelDefinition = {
  id: 'results',
  canNavigateTo: () => {
    return hasRequiredData()
  }
}
```

## Navigation Events

### `SequentialNavigationEvent`

Event data passed to navigation event handlers.

```typescript
interface SequentialNavigationEvent {
  from: number
  to: number
  direction: SequentialDirection
  panel: SequentialPanelDefinition
}
```

**Properties:**

- `from: number` - Source panel index
- `to: number` - Target panel index  
- `direction: SequentialDirection` - Navigation direction
- `panel: SequentialPanelDefinition` - Target panel data

**Example:**
```typescript
const onBeforeNavigate = async (event: SequentialNavigationEvent) => {
  console.log(`Navigating from ${event.from} to ${event.to}`)
  console.log(`Direction: ${event.direction}`)
  console.log(`Target panel: ${event.panel.id}`)
  
  // Validation logic
  return true
}
```

## Manager Interfaces

### `SequentialNavigationManager`

Core interface defining navigation functionality.

```typescript
interface SequentialNavigationManager {
  readonly currentPanel: number
  readonly totalPanels: number
  readonly canGoNext: boolean
  readonly canGoPrevious: boolean
  readonly isFirst: boolean
  readonly isLast: boolean
  readonly progress: number
  next(): Promise<boolean>
  previous(): Promise<boolean>
  goTo(index: number): Promise<boolean>
}
```

**Implemented by:** `NavigationManager` class

**Usage:**
```typescript
function createNavigationUI(manager: SequentialNavigationManager) {
  return {
    currentStep: manager.currentPanel + 1,
    totalSteps: manager.totalPanels,
    progressPercent: manager.progress,
    canGoNext: manager.canGoNext,
    canGoPrevious: manager.canGoPrevious,
    next: () => manager.next(),
    previous: () => manager.previous()
  }
}
```

### `SequentialEventHandlers`

Interface for navigation event callback functions.

```typescript
interface SequentialEventHandlers {
  onBeforeNavigate?: (event: SequentialNavigationEvent) => boolean | Promise<boolean>
  onAfterNavigate?: (event: SequentialNavigationEvent) => void
}
```

**Properties:**

#### `onBeforeNavigate?: (event: SequentialNavigationEvent) => boolean | Promise<boolean>`
Called before navigation occurs. Return `false` to cancel navigation.

```typescript
const handlers: SequentialEventHandlers = {
  onBeforeNavigate: async (event) => {
    // Perform validation
    if (event.direction === 'next') {
      return await validateCurrentStep()
    }
    return true
  }
}
```

#### `onAfterNavigate?: (event: SequentialNavigationEvent) => void`
Called after successful navigation.

```typescript
const handlers: SequentialEventHandlers = {
  onAfterNavigate: (event) => {
    // Analytics tracking
    analytics.track('panel_view', {
      panel_id: event.panel.id,
      direction: event.direction
    })
  }
}
```

### `SequentialManagerOptions`

Configuration options for NavigationManager, extending event handlers.

```typescript
interface SequentialManagerOptions extends SequentialEventHandlers {
  loop?: boolean
}
```

**Properties:**

- `loop?: boolean` - Enable loop navigation (last → first, first → last)
- Plus all properties from `SequentialEventHandlers`

**Example:**
```typescript
const options: SequentialManagerOptions = {
  loop: true,
  onBeforeNavigate: async (event) => {
    console.log('Before navigate:', event)
    return true
  },
  onAfterNavigate: (event) => {
    console.log('After navigate:', event)
  }
}
```

## Configuration

### `SequentialConfig`

Main configuration object for SequentialManager.

```typescript
interface SequentialConfig {
  panels: SequentialPanelDefinition[]
  currentPanel?: number
  loop?: boolean
}
```

**Properties:**

- `panels: SequentialPanelDefinition[]` - Array of panel definitions
- `currentPanel?: number` - Starting panel index (default: 0)
- `loop?: boolean` - Enable loop navigation (default: false)

**Example:**
```typescript
const config: SequentialConfig = {
  panels: [
    { id: 'intro', content: () => 'Welcome!' },
    { id: 'main', component: MainComponent },
    { id: 'outro', content: () => 'Thank you!' }
  ],
  currentPanel: 0,
  loop: false
}

const manager = new SequentialManager(config)
```

## Generic Type Usage

### Typed Panel Props

Use generic type parameters for type-safe panel props:

```typescript
interface UserFormProps {
  username: string
  email: string
  validation: boolean
}

const userPanel: SequentialPanelDefinition<UserFormProps> = {
  id: 'user-form',
  props: {
    username: '',
    email: '',
    validation: true
  }
}
```

### Custom Panel Types

Extend panel definitions for framework-specific implementations:

```typescript
interface VuePanel extends SequentialPanelDefinition {
  component: Component
  transition?: string
}

interface ReactPanel extends SequentialPanelDefinition {
  component: ComponentType
  key?: string
}
```

## Type Guards

Utility functions for type checking:

```typescript
function isPanelDisabled(panel: SequentialPanelDefinition): boolean {
  return Boolean(panel.disabled)
}

function hasValidation(panel: SequentialPanelDefinition): boolean {
  return Boolean(panel.canNavigateFrom || panel.canNavigateTo)
}

async function canLeavePanel(panel: SequentialPanelDefinition): Promise<boolean> {
  if (panel.canNavigateFrom) {
    return await panel.canNavigateFrom()
  }
  return true
}
```

## Migration & Compatibility

These types represent the initial API surface. Future versions will:

- Add new optional properties to interfaces
- Maintain backward compatibility for existing properties
- Use generic constraints for better type inference
- Add utility types for common patterns

**Version History:**
- `v0.1.0` (Initial release) - Initial type definitions

## Related Documentation

- [SequentialManager](./sequential-manager.md) - Implementation of these interfaces
- [NavigationManager](./navigation-manager.md) - Core navigation logic using these types
- [Getting Started](../getting-started.md) - Practical usage examples with TypeScript