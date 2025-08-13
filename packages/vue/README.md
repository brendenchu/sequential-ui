# @sequential-ui/vue

Vue 3 components for Sequential UI - **Coming Soon**

## 🚧 Development Status

This package is currently in development. The Vue 3 implementation will provide beautiful, accessible components with Tailwind CSS styling.

## 📅 Expected Features

- 🎯 **Vue 3 + Composition API**: Modern Vue development experience
- 🎨 **Tailwind CSS**: Utility-first styling with full customization
- ♿ **Accessible**: WCAG 2.1 AA compliant with ARIA support
- 📱 **Touch Friendly**: Swipe gestures and mobile optimizations
- ⌨️ **Keyboard Navigation**: Full keyboard support
- 🔧 **TypeScript**: Complete type safety

## 📦 Installation

```bash
# Install core package (available now)
npm install @sequential-ui/core

# Vue package will be available soon
npm install @sequential-ui/vue
```

## 🎯 Planned Components

- **SequentialContainer**: Main container component
- **SequentialPanel**: Individual panel component
- **SequentialControls**: Navigation controls
- **SequentialIndicators**: Progress indicators

## 🔧 Planned Composables

- **useNavigation**: Access navigation functionality

## 📋 Current Progress

This package scaffold is set up with:
- ✅ TypeScript configuration
- ✅ Vue 3 + Vite build setup
- ✅ Tailwind CSS integration
- ✅ ESLint and Prettier configuration
- 🚧 Components (in development)
- 🚧 Composables (in development)

## 🚀 Quick Start (Preview)

For now, you can use the core package directly:

```typescript
import { SequentialManager } from '@sequential-ui/core'

const manager = new SequentialManager({
  panels: [
    { id: 'step-1' },
    { id: 'step-2' },
    { id: 'step-3' }
  ]
})

// Navigate programmatically
await manager.next()
console.log(manager.currentPanel) // 1
```

## 📖 Documentation

- [Core Package Documentation](../core/README.md) - Available now
- [Getting Started Guide](../../docs/getting-started.md) - Core concepts
- [API Reference](../../docs/api/README.md) - Complete type definitions

## 🤝 Contributing

Vue components will be implemented as part of the next development milestone. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup.

## 📄 License

MIT © [Brenden Chu](https://github.com/brendenchu)