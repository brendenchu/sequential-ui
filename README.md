# Sequential UI

A modern, headless UI library for building sequential user interfaces with TypeScript. Includes a framework-agnostic core and Vue 3 components for easy integration.

## 🚀 Quick Start

### Installation

**For Vue 3 Projects:**
```bash
# Vue package includes core as dependency
npm install @sequential-ui/vue

# Or with pnpm
pnpm add @sequential-ui/vue
```

**For Custom Framework Integration:**
```bash
# Core package only (for React, Svelte, etc.)
npm install @sequential-ui/core
```

### Basic Usage

**Vue 3 Components:**

```vue
<template>
  <SequentialContainer
    :panels="panels"
    v-model="currentPanel"
    :show-controls="true"
    :show-progress="true"
    :show-indicators="true"
  >
    <template #panel="{ panel, index }">
      <div class="p-8 text-center">
        <h2 class="text-2xl font-bold mb-4">{{ panel.title }}</h2>
        <p class="text-gray-600">{{ panel.content }}</p>
      </div>
    </template>
  </SequentialContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SequentialContainer } from '@sequential-ui/vue'

const currentPanel = ref(0)
const panels = [
  { id: 'welcome', title: 'Welcome', content: 'Get started with Sequential UI' },
  { id: 'features', title: 'Features', content: 'Discover what you can build' },
  { id: 'finish', title: 'Finish', content: 'You are ready to go!' }
]
</script>
```

**Core Package (Framework-agnostic):**

```typescript
import { SequentialManager } from '@sequential-ui/core'

// Create manager
const manager = new SequentialManager({
  panels: [
    { id: 'welcome', title: 'Welcome', content: 'Get started with Sequential UI' },
    { id: 'features', title: 'Features', content: 'Discover what you can build' },
    { id: 'finish', title: 'Finish', content: 'You are ready to go!' }
  ],
  currentPanel: 0
})

// Navigate
await manager.next()
console.log(manager.currentPanel)  // 1
console.log(manager.progress)      // 66.67
```

## 🎯 Use Cases

- **Setup Wizards**: Guide users through configuration processes
- **Form Wizards**: Break complex forms into manageable steps
- **Onboarding Flows**: Welcome new users with interactive tours
- **Product Carousels**: Showcase products with smooth navigation
- **Tutorial Steps**: Create interactive learning experiences
- **Data Collection**: Multi-step surveys and questionnaires

## 📦 Packages

| Package                                | Description                   | Status     |
|----------------------------------------|-------------------------------|------------|
| [@sequential-ui/core](./packages/core) | Framework-agnostic core logic | ✅ **Ready**  |
| [@sequential-ui/vue](./packages/vue)   | Vue 3 components              | ✅ **Ready** |
| @sequential-ui/react                   | React components              | 🔄 Planned |
| @sequential-ui/svelte                  | Svelte components             | 🔄 Planned |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

MIT © [Brenden Chu](https://github.com/brendenchu)
