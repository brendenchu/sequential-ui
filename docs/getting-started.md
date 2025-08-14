# Getting Started with Sequential UI

Sequential UI is a headless, TypeScript-first library for building sequential user interfaces. This guide covers installation, basic concepts, and usage of the core functionality.

## Installation

**For Vue 3 Projects:**

```bash
# Vue package includes core as dependency
npm install @sequential-ui/vue
```

**For Custom Framework Integration:**

```bash
# Core package only (for React, Svelte, etc.)
npm install @sequential-ui/core
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

## Vue 3 Integration

For Vue applications, use the `SequentialContainer` component for a complete UI solution:

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

### Vue Composable Usage

For more control, use the `useNavigation` composable directly:

```vue
<template>
  <div>
    <div class="panel">
      <h3>{{ currentPanelData?.title }}</h3>
      <p>Panel {{ navigation.currentPanel.value + 1 }} of {{ navigation.totalPanels.value }}</p>
    </div>
    
    <div class="controls">
      <button 
        @click="navigation.previous" 
        :disabled="!navigation.canGoPrevious.value"
      >
        Previous
      </button>
      <button 
        @click="navigation.next" 
        :disabled="!navigation.canGoNext.value"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNavigation } from '@sequential-ui/vue'

const panels = [
  { id: 'step-1', title: 'Welcome' },
  { id: 'step-2', title: 'Setup' },
  { id: 'step-3', title: 'Complete' }
]

const navigation = useNavigation(panels, 0, {
  loop: false
})

const currentPanelData = computed(() => navigation.getCurrentPanel())
</script>
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

### Vue Wizard Example

```vue
<template>
  <SequentialContainer
    :panels="wizardPanels"
    v-model="currentStep"
    :show-progress="true"
    :on-before-navigate="validateStep"
  >
    <template #panel="{ panel, index }">
      <div class="p-6">
        <h3 class="text-xl font-bold mb-4">{{ panel.title }}</h3>
        
        <!-- Step-specific content -->
        <div v-if="panel.id === 'personal-info'" class="space-y-4">
          <input v-model="formData.name" placeholder="Name" class="w-full p-2 border rounded" />
          <input v-model="formData.email" placeholder="Email" class="w-full p-2 border rounded" />
        </div>
        
        <div v-else-if="panel.id === 'preferences'" class="space-y-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="formData.notifications" class="mr-2" />
            Enable notifications
          </label>
        </div>
        
        <div v-else-if="panel.id === 'review'" class="space-y-2">
          <p><strong>Name:</strong> {{ formData.name }}</p>
          <p><strong>Email:</strong> {{ formData.email }}</p>
          <p><strong>Notifications:</strong> {{ formData.notifications ? 'Yes' : 'No' }}</p>
        </div>
      </div>
    </template>
  </SequentialContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SequentialContainer } from '@sequential-ui/vue'
import type { SequentialNavigationEvent } from '@sequential-ui/core'

const currentStep = ref(0)
const formData = reactive({
  name: '',
  email: '',
  notifications: true
})

const wizardPanels = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'personal-info', title: 'Personal Information' },
  { id: 'preferences', title: 'Preferences' },
  { id: 'review', title: 'Review' },
  { id: 'complete', title: 'Complete' }
]

async function validateStep(event: SequentialNavigationEvent): Promise<boolean> {
  if (event.from === 1 && !formData.name.trim()) {
    alert('Name is required')
    return false
  }
  return true
}
</script>
```

### Vue Carousel Example

```vue
<template>
  <SequentialContainer
    :panels="images"
    v-model="currentImage"
    :loop="true"
    :show-indicators="true"
    container-class="relative overflow-hidden rounded-lg"
  >
    <template #panel="{ panel }">
      <div class="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <div class="text-white text-center">
          <div class="text-4xl mb-2">{{ panel.icon }}</div>
          <h3 class="text-xl font-bold">{{ panel.title }}</h3>
        </div>
      </div>
    </template>
    
    <template #controls="{ canGoNext, canGoPrevious, next, previous }">
      <button 
        @click="previous"
        :disabled="!canGoPrevious"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full"
      >
        ←
      </button>
      <button 
        @click="next"
        :disabled="!canGoNext"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full"
      >
        →
      </button>
    </template>
  </SequentialContainer>
  
  <div class="mt-4 text-center">
    <button @click="toggleAutoPlay" class="px-4 py-2 bg-blue-600 text-white rounded">
      {{ isAutoPlaying ? 'Pause' : 'Play' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { SequentialContainer, useNavigation } from '@sequential-ui/vue'

const currentImage = ref(0)
const isAutoPlaying = ref(false)

const images = [
  { id: 'img1', title: 'Nature', icon: '🌲' },
  { id: 'img2', title: 'Ocean', icon: '🌊' },
  { id: 'img3', title: 'Mountains', icon: '🏔️' }
]

// Auto-play functionality
const navigation = useNavigation(images, 0, { loop: true })
let autoPlayInterval: NodeJS.Timeout | null = null

watch(isAutoPlaying, (playing) => {
  if (playing) {
    autoPlayInterval = setInterval(() => navigation.next(), 3000)
  } else if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
})

function toggleAutoPlay() {
  isAutoPlaying.value = !isAutoPlaying.value
}

onUnmounted(() => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
})
</script>
```

### Core JavaScript Example

For non-Vue applications, use the core SequentialManager:

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