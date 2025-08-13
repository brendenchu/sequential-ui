# NavigationManager

Low-level navigation manager that handles sequential panel navigation with state management and validation. This class implements the core navigation logic used by SequentialManager.

## Constructor

```typescript
new NavigationManager(
  panels: SequentialPanelDefinition[],
  initialPanel: number = 0,
  options: SequentialManagerOptions = {}
)
```

Creates a new NavigationManager instance with panels and options.

### Parameters

- `panels: SequentialPanelDefinition[]` - Array of panel definitions
- `initialPanel: number = 0` - Starting panel index (default: 0)
- `options: SequentialManagerOptions = {}` - Configuration options

### Example

```typescript
import { NavigationManager } from '@sequential-ui/core'

const navigation = new NavigationManager(
  [
    { id: 'step-1' },
    { id: 'step-2' },
    { id: 'step-3' }
  ],
  0, // Start at first panel
  {
    loop: false,
    onBeforeNavigate: async (event) => {
      console.log('Before navigate:', event)
      return true // Allow navigation
    },
    onAfterNavigate: (event) => {
      console.log('After navigate:', event)
    }
  }
)
```

## State Properties

All state properties are read-only getters providing current navigation state.

### `currentPanel: number`

The zero-based index of the currently active panel.

```typescript
console.log(navigation.currentPanel) // 0, 1, 2, etc.
```

### `totalPanels: number`

Total number of panels in the sequence.

```typescript
console.log(navigation.totalPanels) // 3
```

### `isFirst: boolean`

Whether the current panel is the first in the sequence.

```typescript
if (navigation.isFirst) {
  console.log('At the beginning')
}
```

### `isLast: boolean`

Whether the current panel is the last in the sequence.

```typescript
if (navigation.isLast) {
  console.log('At the end')
}
```

### `canGoPrevious: boolean`

Whether navigation to the previous panel is possible.

```typescript
const canGoBack = navigation.canGoPrevious
```

**Logic:**
- Returns `false` if navigation is in progress
- If `loop: true` - returns `true` when there's more than one panel
- If `loop: false` - returns `true` unless on first panel

### `canGoNext: boolean`

Whether navigation to the next panel is possible.

```typescript
const canGoForward = navigation.canGoNext
```

**Logic:**
- Returns `false` if navigation is in progress
- If `loop: true` - returns `true` when there's more than one panel
- If `loop: false` - returns `true` unless on last panel

### `progress: number`

Current progress as a percentage (0-100).

```typescript
console.log(`Progress: ${navigation.progress}%`)
```

**Calculation:** `((currentPanel + 1) / totalPanels) * 100`

### `isNavigating: boolean`

Whether a navigation operation is currently in progress.

```typescript
if (navigation.isNavigating) {
  console.log('Navigation in progress, please wait...')
}
```

## Navigation Methods

All navigation methods are asynchronous and return `Promise<boolean>` indicating success.

### `goTo(index: number): Promise<boolean>`

Navigate directly to a specific panel by index.

```typescript
const success = await navigation.goTo(2)

if (success) {
  console.log('Successfully navigated to panel 2')
} else {
  console.log('Navigation was blocked')
}
```

**Parameters:**
- `index: number` - Target panel index

**Process:**
1. Validates index bounds (auto-clamps to valid range)
2. Skips if already at target panel
3. Sets `isNavigating` to `true`
4. Runs validation via `validateNavigation()`
5. Triggers `onBeforeNavigate` hook
6. Updates current panel
7. Triggers `onAfterNavigate` hook
8. Sets `isNavigating` to `false`

**Returns:**
- `true` if navigation succeeded
- `false` if blocked by validation, hooks, or errors

### `next(): Promise<boolean>`

Navigate to the next panel in sequence.

```typescript
const success = await navigation.next()
```

**Behavior:**
- Checks `canGoNext` first
- If at last panel and `loop: true`, navigates to first panel
- Otherwise navigates to `currentPanel + 1`
- Delegates to `goTo()` for actual navigation

### `previous(): Promise<boolean>`

Navigate to the previous panel in sequence.

```typescript
const success = await navigation.previous()
```

**Behavior:**
- Checks `canGoPrevious` first
- If at first panel and `loop: true`, navigates to last panel
- Otherwise navigates to `currentPanel - 1`
- Delegates to `goTo()` for actual navigation

## Panel Management

### `updatePanels(panels: SequentialPanelDefinition[]): void`

Update the panels array and adjust current position if needed.

```typescript
const newPanels = [
  { id: 'intro' },
  { id: 'main' },
  { id: 'outro' },
  { id: 'bonus' } // Added new panel
]

navigation.updatePanels(newPanels)
```

**Behavior:**
- Replaces current panels array
- If `currentPanel` index becomes invalid, adjusts to last valid panel
- Immediately available for navigation

### `getCurrentPanel(): SequentialPanelDefinition | null`

Get the currently active panel data.

```typescript
const current = navigation.getCurrentPanel()
if (current) {
  console.log('Current panel:', current.id)
}
```

### `getPanel(index: number): SequentialPanelDefinition | null`

Get panel data by index.

```typescript
const panel = navigation.getPanel(1)
if (panel) {
  console.log('Panel 1:', panel.id)
}
```

## Validation System

The NavigationManager includes a comprehensive validation system that runs before each navigation.

### Internal Validation Process

```typescript
private async validateNavigation(from: number, to: number): Promise<boolean>
```

**Validation Steps:**
1. **Panel Existence** - Validates both source and target panels exist
2. **Panel State** - Checks if target panel is disabled
3. **Source Validation** - Calls `fromPanel.canNavigateFrom()` if defined
4. **Target Validation** - Calls `toPanel.canNavigateTo()` if defined

### Panel-Level Validation

Panels can define validation functions:

```typescript
const panels = [
  {
    id: 'form-step',
    canNavigateFrom: async () => {
      // Validate form before leaving
      return await validateForm()
    }
  },
  {
    id: 'premium-step',
    canNavigateTo: async () => {
      // Check access before entering
      return await checkPremiumAccess()
    },
    disabled: false // Can also be disabled entirely
  }
]
```

## Event System

NavigationManager supports event hooks for custom navigation logic.

### Event Handlers

Configure event handlers in the constructor options:

```typescript
const navigation = new NavigationManager(panels, 0, {
  onBeforeNavigate: async (event: SequentialNavigationEvent) => {
    console.log('Before:', event.from, '→', event.to)
    
    // Perform custom validation
    if (event.to === 2 && !userHasAccess) {
      return false // Block navigation
    }
    
    return true // Allow navigation
  },
  
  onAfterNavigate: (event: SequentialNavigationEvent) => {
    console.log('After:', event.from, '→', event.to)
    
    // Track analytics
    analytics.track('panel_view', {
      panel_id: event.panel.id,
      direction: event.direction
    })
  }
})
```

### Navigation Event Object

```typescript
interface SequentialNavigationEvent {
  from: number              // Source panel index
  to: number               // Target panel index
  direction: SequentialDirection  // 'next' | 'previous' | 'none'
  panel: SequentialPanelDefinition // Target panel data
}
```

## Error Handling

NavigationManager handles errors gracefully:

```typescript
try {
  const success = await navigation.goTo(2)
  // success is boolean, no exceptions thrown
} catch (error) {
  // Only thrown for unexpected errors
  console.error('Unexpected navigation error:', error)
}
```

**Error Scenarios:**
- Validation failures → Returns `false`
- Hook cancellation → Returns `false`
- Panel validation errors → Returns `false`, logs error
- Unexpected errors → Returns `false`, logs error

## Performance Considerations

- **State Caching** - Properties like `canGoNext` are computed on-demand
- **Validation Debouncing** - `isNavigating` prevents concurrent navigation
- **Memory Management** - No automatic cleanup (managed by SequentialManager)

## Advanced Usage

### Custom Validation Logic

```typescript
const navigation = new NavigationManager(panels, 0, {
  onBeforeNavigate: async (event) => {
    // Custom business logic
    if (event.direction === 'next') {
      return await validateCurrentStep()
    }
    return true
  }
})
```

### Loop Navigation

```typescript
const carousel = new NavigationManager(images, 0, {
  loop: true // Enables infinite scrolling
})

// Will loop from last to first
await carousel.next()
```

### Disabled Panels

```typescript
const panels = [
  { id: 'step-1' },
  { id: 'step-2', disabled: true }, // Skipped during navigation
  { id: 'step-3' }
]
```

## TypeScript Support

NavigationManager implements the `SequentialNavigationManager` interface:

```typescript
import type { 
  NavigationManager,
  SequentialNavigationManager,
  SequentialManagerOptions
} from '@sequential-ui/core'

const navigation: SequentialNavigationManager = new NavigationManager(...)
```

## Related APIs

- [SequentialManager](./sequential-manager.md) - High-level wrapper around NavigationManager
- [Types](./types.md) - TypeScript definitions for all interfaces and types