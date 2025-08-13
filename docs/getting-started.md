# Getting Started with Sequential UI

Sequential UI is a headless, TypeScript-first library for building sequential user interfaces. This guide covers installation, basic concepts, and usage of the core functionality.

## Installation

Sequential UI is distributed as separate packages for maximum flexibility:

```bash
# Core package (framework-agnostic)
npm install @sequential-ui/core

# Vue 3 components (optional)
npm install @sequential-ui/vue
```

Or install both together:

```bash
npm install @sequential-ui/core @sequential-ui/vue
```

## Core Concepts

### Panels

A **panel** represents a single step or view in your sequential interface. Panels are defined as objects with an `id` and optional configuration:

```typescript
const panels = [
  { id: 'step-1' },
  { id: 'step-2' },
  { id: 'step-3' }
]
```

### Sequential Manager

The `SequentialManager` is the heart of Sequential UI. It manages navigation state and provides methods for moving between panels:

```typescript
import { SequentialManager } from '@sequential-ui/core'

const manager = new SequentialManager({
  panels: [
    { id: 'welcome' },
    { id: 'setup' },
    { id: 'finish' }
  ],
  currentPanel: 0,
  loop: false
})
```

## Basic Usage

### Creating a Sequential Manager

```typescript
import { SequentialManager, type SequentialConfig } from '@sequential-ui/core'

// Define your panels
const panels = [
  { id: 'introduction', content: () => 'Welcome to our app!' },
  { id: 'configuration', content: () => 'Configure your settings' },
  { id: 'completion', content: () => 'Setup complete!' }
]

// Create configuration
const config: SequentialConfig = {
  panels,
  currentPanel: 0,  // Start at first panel
  loop: false        // Don't loop back to start
}

// Initialize manager
const manager = new SequentialManager(config)
```

### Navigation

The manager provides simple navigation methods:

```typescript
// Navigate to next panel
await manager.next()

// Navigate to previous panel
await manager.previous()

// Jump to specific panel by index
await manager.goTo(2)

// Check navigation state
console.log('Current panel:', manager.currentPanel)        // 0, 1, 2, etc.
console.log('Total panels:', manager.totalPanels)          // 3
console.log('Can go next:', manager.canGoNext)             // true/false
console.log('Can go previous:', manager.canGoPrevious)     // true/false
console.log('Is first panel:', manager.isFirst)            // true/false
console.log('Is last panel:', manager.isLast)              // true/false
console.log('Progress:', manager.progress)                 // 0-100
```

### Panel Management

```typescript
// Get current panel data
const currentPanel = manager.getCurrentPanel()
console.log('Current panel ID:', currentPanel?.id)

// Get specific panel by index
const firstPanel = manager.getPanel(0)
console.log('First panel:', firstPanel)
```

### Configuration Updates

You can update the configuration after initialization:

```typescript
// Add more panels
const newPanels = [
  ...panels,
  { id: 'bonus-step', content: () => 'Bonus content!' }
]

manager.updateConfig({ panels: newPanels })

// Enable looping
manager.updateConfig({ loop: true })

// Get current configuration
const currentConfig = manager.getConfig()
```

## TypeScript Support

Sequential UI is built with TypeScript and provides comprehensive type definitions:

```typescript
import type {
  SequentialManager,
  SequentialConfig,
  SequentialPanelDefinition,
  SequentialNavigationEvent,
  SequentialDirection
} from '@sequential-ui/core'

// Typed panel definitions
const typedPanels: SequentialPanelDefinition[] = [
  {
    id: 'step-1',
    disabled: false,
    canNavigateFrom: () => true,
    canNavigateTo: () => true
  }
]

// Typed configuration
const typedConfig: SequentialConfig = {
  panels: typedPanels,
  currentPanel: 0,
  loop: false
}
```

## Advanced Panel Configuration

Panels support advanced configuration for validation and conditional navigation:

```typescript
const advancedPanels = [
  {
    id: 'form-step',
    // Prevent navigation if form is invalid
    canNavigateFrom: async () => {
      const isValid = await validateForm()
      return isValid
    }
  },
  {
    id: 'premium-step',
    // Only allow navigation if user has premium access
    canNavigateTo: async () => {
      const hasAccess = await checkPremiumAccess()
      return hasAccess
    }
  },
  {
    id: 'disabled-step',
    // Completely disable this step
    disabled: true
  }
]
```

## Error Handling

Navigation methods return `Promise<boolean>` to indicate success or failure:

```typescript
const success = await manager.next()

if (!success) {
  console.log('Navigation was blocked (validation failed, disabled panel, etc.)')
}
```

## Cleanup

When you're done with a manager instance, call `destroy()` to clean up:

```typescript
manager.destroy()
```

## Next Steps

- **Vue Integration**: Learn how to use Sequential UI with Vue 3 components
- **Validation**: Implement form validation with panel constraints
- **Events**: Handle navigation events for advanced use cases
- **Styling**: Customize the appearance of your sequential interfaces

## Examples

### Simple Wizard

```typescript
const wizardManager = new SequentialManager({
  panels: [
    { id: 'welcome' },
    { id: 'personal-info' },
    { id: 'preferences' },
    { id: 'review' },
    { id: 'complete' }
  ],
  currentPanel: 0
})

// Navigation event handling
async function handleNext() {
  const success = await wizardManager.next()
  
  if (success) {
    updateUI()
  } else {
    showValidationErrors()
  }
}
```

### Image Carousel

```typescript
const carouselManager = new SequentialManager({
  panels: [
    { id: 'image-1' },
    { id: 'image-2' },
    { id: 'image-3' }
  ],
  currentPanel: 0,
  loop: true  // Allow infinite scrolling
})

// Auto-advance every 3 seconds
setInterval(async () => {
  await carouselManager.next()
  updateCarouselDisplay()
}, 3000)
```