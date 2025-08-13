# Sequential UI API Reference

Complete API documentation for Sequential UI, a headless TypeScript library for building sequential user interfaces.

## Quick Reference

### Installation

```bash
npm install @sequential-ui/core
```

### Basic Import

```typescript
import { SequentialManager } from '@sequential-ui/core'
import type { SequentialConfig, SequentialPanelDefinition } from '@sequential-ui/core'
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

### Core Classes

- **[SequentialManager](./sequential-manager.md)** - Main orchestrator class for sequential navigation
- **[NavigationManager](./navigation-manager.md)** - Low-level navigation logic and state management

### Type Definitions

- **[Types](./types.md)** - Complete TypeScript interface and type definitions

## Package Information

- **Version**: 0.1.0
- **Package**: `@sequential-ui/core`
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

- ✅ Framework-agnostic core logic
- ✅ Comprehensive TypeScript support
- ✅ Async validation hooks
- ✅ Event-driven navigation
- ✅ Loop navigation support
- ✅ Progress tracking
- ✅ Panel state management

## Migration & Compatibility

This is the initial API (v0.1.0) for the core package. Future versions will maintain backward compatibility for the core API surface.

## Related Documentation

- [Getting Started Guide](../getting-started.md) - Learn basic concepts and usage
- [Vue Integration](../vue-integration.md) - Using with Vue 3 (coming soon)