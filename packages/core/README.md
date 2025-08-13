# @sequential-ui/core

Framework-agnostic core logic for Sequential UI. Build sequential interfaces like wizards, steppers, and carousels with any frontend framework.

## ✨ Features

- 🎯 **Framework Agnostic**: Works with React, Vue, Svelte, or vanilla JavaScript
- 🔧 **TypeScript First**: Complete type safety and excellent IntelliSense
- ⚡ **Lightweight**: Zero dependencies, minimal bundle size
- 🚀 **Async Ready**: Built-in support for async validation and navigation
- 🎛️ **Configurable**: Flexible panel definitions and navigation options

## 📦 Installation

```bash
npm install @sequential-ui/core
```

## 🚀 Quick Start

```typescript
import { SequentialManager } from '@sequential-ui/core'

// Define your panels
const panels = [
  { id: 'step-1' },
  { id: 'step-2' },
  { id: 'step-3' }
]

// Create manager
const manager = new SequentialManager({
  panels,
  currentPanel: 0,
  loop: false
})

// Navigate
await manager.next()     // Move to step-2
await manager.previous() // Back to step-1
await manager.goTo(2)    // Jump to step-3

// Check state
console.log(manager.currentPanel)  // 2
console.log(manager.canGoNext)     // false (last panel)
console.log(manager.progress)      // 100
```

## 📚 API Reference

### SequentialManager

The main class for managing sequential navigation.

```typescript
constructor(config: SequentialConfig)
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentPanel` | `number` | Current panel index (0-based) |
| `totalPanels` | `number` | Total number of panels |
| `canGoNext` | `boolean` | Whether next navigation is possible |
| `canGoPrevious` | `boolean` | Whether previous navigation is possible |
| `isFirst` | `boolean` | Whether currently on first panel |
| `isLast` | `boolean` | Whether currently on last panel |
| `progress` | `number` | Progress percentage (0-100) |
| `isNavigating` | `boolean` | Whether navigation is in progress |

#### Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `next()` | `Promise<boolean>` | Navigate to next panel |
| `previous()` | `Promise<boolean>` | Navigate to previous panel |
| `goTo(index)` | `Promise<boolean>` | Navigate to specific panel |
| `getCurrentPanel()` | `SequentialPanelDefinition \| null` | Get current panel data |
| `getPanel(index)` | `SequentialPanelDefinition \| null` | Get panel by index |
| `updateConfig(config)` | `void` | Update configuration |
| `getConfig()` | `SequentialConfig` | Get current configuration |
| `destroy()` | `void` | Clean up resources |

### Types

```typescript
interface SequentialConfig {
  panels: SequentialPanelDefinition[]
  currentPanel?: number
  loop?: boolean
}

interface SequentialPanelDefinition {
  id: string | number
  component?: unknown
  props?: Record<string, unknown>
  content?: () => unknown
  disabled?: boolean
  canNavigateFrom?: () => boolean | Promise<boolean>
  canNavigateTo?: () => boolean | Promise<boolean>
}

type SequentialDirection = 'next' | 'previous' | 'none'
```

## 🎯 Use Cases

### Form Wizard

```typescript
const formWizard = new SequentialManager({
  panels: [
    {
      id: 'personal-info',
      canNavigateFrom: async () => {
        return await validatePersonalInfo()
      }
    },
    {
      id: 'contact-details',
      canNavigateFrom: async () => {
        return await validateContactDetails()
      }
    },
    { id: 'review' },
    { id: 'complete' }
  ]
})
```

### Image Carousel

```typescript
const carousel = new SequentialManager({
  panels: [
    { id: 'image-1' },
    { id: 'image-2' },
    { id: 'image-3' }
  ],
  loop: true  // Enable infinite scrolling
})

// Auto-advance every 3 seconds
setInterval(() => carousel.next(), 3000)
```

### Conditional Navigation

```typescript
const conditionalFlow = new SequentialManager({
  panels: [
    { id: 'welcome' },
    {
      id: 'premium-only',
      canNavigateTo: async () => {
        return await userHasPremiumAccess()
      }
    },
    {
      id: 'admin-panel',
      disabled: !userIsAdmin
    }
  ]
})
```

## 🔧 Framework Integration

This core package is designed to be wrapped by framework-specific implementations:

- **Vue 3**: `@sequential-ui/vue`
- **React**: `@sequential-ui/react` (planned)
- **Svelte**: `@sequential-ui/svelte` (planned)

## 📄 License

MIT © [Brenden Chu](https://github.com/brendenchu)