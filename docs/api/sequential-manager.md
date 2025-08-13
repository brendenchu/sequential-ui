# SequentialManager

The main orchestrator class for sequential navigation. Provides a high-level API with configuration management and delegates core navigation logic to the NavigationManager.

## Constructor

```typescript
new SequentialManager(config: SequentialConfig)
```

Creates a new SequentialManager instance with the provided configuration.

### Parameters

- `config: SequentialConfig` - Configuration object defining panels, initial state, and options

### Example

```typescript
import { SequentialManager } from '@sequential-ui/core'

const manager = new SequentialManager({
  panels: [
    { id: 'welcome', content: () => 'Welcome!' },
    { id: 'setup', content: () => 'Configure settings' },
    { id: 'complete', content: () => 'All done!' }
  ],
  currentPanel: 0,
  loop: false
})
```

## State Properties

All state properties are read-only getters that provide current navigation state.

### `currentPanel: number`

The zero-based index of the currently active panel.

```typescript
console.log(manager.currentPanel) // 0, 1, 2, etc.
```

### `totalPanels: number`

The total number of panels in the sequence.

```typescript
console.log(manager.totalPanels) // 3
```

### `canGoNext: boolean`

Whether navigation to the next panel is currently possible.

```typescript
if (manager.canGoNext) {
  await manager.next()
}
```

Returns `false` if:
- Currently on the last panel and loop is disabled
- Navigation is in progress
- Next panel validation fails

### `canGoPrevious: boolean`

Whether navigation to the previous panel is currently possible.

```typescript
if (manager.canGoPrevious) {
  await manager.previous()
}
```

Returns `false` if:
- Currently on the first panel and loop is disabled
- Navigation is in progress
- Previous panel validation fails

### `isFirst: boolean`

Whether the current panel is the first panel in the sequence.

```typescript
if (manager.isFirst) {
  console.log('At the beginning')
}
```

### `isLast: boolean`

Whether the current panel is the last panel in the sequence.

```typescript
if (manager.isLast) {
  console.log('At the end')
}
```

### `progress: number`

Current progress as a percentage (0-100).

```typescript
console.log(`${manager.progress}% complete`) // "33% complete"
```

Calculated as: `((currentPanel + 1) / totalPanels) * 100`

### `isNavigating: boolean`

Whether a navigation operation is currently in progress.

```typescript
if (manager.isNavigating) {
  console.log('Navigation in progress...')
}
```

## Navigation Methods

All navigation methods are asynchronous and return a Promise<boolean> indicating success.

### `next(): Promise<boolean>`

Navigate to the next panel in the sequence.

```typescript
const success = await manager.next()

if (!success) {
  console.log('Navigation blocked (validation failed, at end, etc.)')
}
```

**Behavior:**
- If on the last panel and `loop: false`, returns `false`
- If on the last panel and `loop: true`, navigates to first panel
- Runs validation before navigation
- Returns `false` if validation fails

### `previous(): Promise<boolean>`

Navigate to the previous panel in the sequence.

```typescript
const success = await manager.previous()

if (!success) {
  console.log('Navigation blocked')
}
```

**Behavior:**
- If on the first panel and `loop: false`, returns `false`
- If on the first panel and `loop: true`, navigates to last panel
- Runs validation before navigation
- Returns `false` if validation fails

### `goTo(index: number): Promise<boolean>`

Navigate directly to a specific panel by index.

```typescript
// Jump to the third panel (index 2)
const success = await manager.goTo(2)

if (success) {
  console.log('Successfully jumped to panel 2')
}
```

**Parameters:**
- `index: number` - Zero-based index of the target panel

**Behavior:**
- Index is automatically clamped to valid range `[0, totalPanels-1]`
- If target index equals current panel, immediately returns `true`
- Runs validation before navigation
- Returns `false` if validation fails

## Configuration Management

### `updateConfig(config: Partial<SequentialConfig>): void`

Update the manager's configuration after initialization.

```typescript
// Add more panels
manager.updateConfig({
  panels: [
    ...existingPanels,
    { id: 'bonus-step', content: () => 'Bonus content!' }
  ]
})

// Enable looping
manager.updateConfig({ loop: true })
```

**Parameters:**
- `config: Partial<SequentialConfig>` - Partial configuration to merge with existing config

**Behavior:**
- Merges provided config with existing configuration
- If `panels` are updated, automatically adjusts `currentPanel` if needed
- Updates are applied immediately

### `getConfig(): SequentialConfig`

Get a copy of the current configuration.

```typescript
const currentConfig = manager.getConfig()
console.log('Current loop setting:', currentConfig.loop)
```

**Returns:**
- A new object containing the current configuration (not a reference)

## Panel Management

### `getCurrentPanel(): SequentialPanelDefinition | null`

Get the data for the currently active panel.

```typescript
const currentPanel = manager.getCurrentPanel()
if (currentPanel) {
  console.log('Current panel ID:', currentPanel.id)
}
```

**Returns:**
- `SequentialPanelDefinition | null` - The current panel data, or `null` if no panels exist

### `getPanel(index: number): SequentialPanelDefinition | null`

Get panel data by index.

```typescript
const firstPanel = manager.getPanel(0)
const lastPanel = manager.getPanel(manager.totalPanels - 1)
```

**Parameters:**
- `index: number` - Zero-based index of the panel to retrieve

**Returns:**
- `SequentialPanelDefinition | null` - The panel data, or `null` if index is invalid

## Lifecycle Management

### `destroy(): void`

Clean up the manager instance and release resources.

```typescript
manager.destroy()
```

**Note:** Currently a placeholder in the current implementation. Future versions will add cleanup logic for event listeners and other resources.

## Event Integration

The SequentialManager automatically handles navigation events through private methods that can be extended in future versions:

- `handleBeforeNavigate(event: SequentialNavigationEvent): Promise<boolean>`
- `handleAfterNavigate(event: SequentialNavigationEvent): void`

These are currently placeholders that return `true` and do nothing respectively, but provide extension points for validation, logging, and custom business logic.

## Error Handling

Navigation methods catch errors and return `false` rather than throwing. Errors are logged to the console for debugging.

```typescript
try {
  const success = await manager.next()
  // success will be false if navigation failed, no exception thrown
} catch (error) {
  // This should not happen with current implementation
}
```

## TypeScript Support

The SequentialManager is fully typed with comprehensive TypeScript definitions:

```typescript
import type { SequentialManager, SequentialConfig } from '@sequential-ui/core'

// All methods and properties have full type information
const manager: SequentialManager = new SequentialManager(config)
const currentIndex: number = manager.currentPanel
const canAdvance: boolean = manager.canGoNext
```

## Related APIs

- [NavigationManager](./navigation-manager.md) - Low-level navigation implementation
- [Types](./types.md) - TypeScript definitions for SequentialConfig and related types