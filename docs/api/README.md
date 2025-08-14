# Sequential UI API Reference

Complete API documentation for Sequential UI, a headless TypeScript library for building sequential user interfaces.

## Quick Reference

### Installation

```bash
# Vue 3 components (includes core dependency)
npm install @sequential-ui/vue

# Framework-agnostic core (for custom integrations)
npm install @sequential-ui/core
```

### Basic Import

```typescript
// Core package
import { SequentialManager } from '@sequential-ui/core'
import type { SequentialConfig, SequentialPanelDefinition } from '@sequential-ui/core'

// Vue package
import { SequentialContainer, useNavigation } from '@sequential-ui/vue'
```

### Essential Usage

```typescript
const manager = new SequentialManager({
  panels: [
    { id: 'step-1' },
    { id: 'step-2' },
    { id: 'step-3' }
  ],
  currentPanel: 0,
  loop: false
})

// Navigate
await manager.next()
await manager.previous()
await manager.goTo(2)

// Check state
console.log(manager.currentPanel, manager.progress, manager.canGoNext)
```

## API Documentation

### Vue 3 Components

- **[SequentialContainer](./vue-components.md)** - Main Vue component for sequential navigation
- **[useNavigation](./vue-composables.md)** - Vue composable for reactive navigation state

### Core Classes

Sequential UI's core functionality is built on top of two main classes that provide framework-agnostic navigation logic:

- **SequentialManager** - Main orchestrator class for sequential navigation
- **NavigationManager** - Low-level navigation logic and state management

These classes are fully documented with inline TypeScript definitions and examples in the [Getting Started Guide](../getting-started.md).

## Package Information

- **Version**: 0.1.0
- **Packages**: `@sequential-ui/core`, `@sequential-ui/vue`
- **License**: MIT
- **TypeScript**: Full type definitions included

## Architecture

Sequential UI uses a layered architecture:

1. **SequentialManager** - High-level API with configuration management
2. **NavigationManager** - Core navigation logic and validation
3. **Types** - Comprehensive TypeScript definitions

The library is framework-agnostic and provides headless functionality that can be integrated with any UI framework.

## Navigation Flow

```
SequentialManager
    ↓ delegates to
NavigationManager
    ↓ validates via
Panel.canNavigateFrom() / Panel.canNavigateTo()
    ↓ triggers
onBeforeNavigate → Navigation → onAfterNavigate
```

## Key Features

- Framework-agnostic core logic
- Comprehensive TypeScript support
- Async validation hooks
- Event-driven navigation
- Loop navigation support
- Progress tracking
- Panel state management

## Migration & Compatibility

This is the initial API (v0.1.0) for the core package. Future versions will maintain backward compatibility for the core API surface.

## Related Documentation

- [Getting Started Guide](../getting-started.md) - Learn basic concepts and usage with complete examples
- [Vue Components API](./vue-components.md) - Complete Vue 3 component reference
- [Vue Composables API](./vue-composables.md) - useNavigation composable documentation