# @sequential-ui/vue

Vue 3 components for Sequential UI with Composition API and TypeScript support.

## ✨ Features

- 🎯 **Vue 3 + Composition API**: Modern Vue development experience
- 🎨 **Tailwind CSS**: Utility-first styling with full customization
- ♿ **Accessible**: WCAG 2.1 AA compliant with ARIA support
- 📱 **Touch Friendly**: Swipe gestures and mobile optimizations
- ⌨️ **Keyboard Navigation**: Full keyboard support
- 🔧 **TypeScript**: Complete type safety

## 📦 Installation

```bash
# Vue package includes core as dependency
npm install @sequential-ui/vue

# Or with pnpm
pnpm add @sequential-ui/vue
```

## 🎯 Components

- **SequentialContainer**: Main container component with built-in navigation
- **useNavigation**: Composable for reactive navigation state management

## 🚀 Quick Start

### Basic Usage

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

### Using the Composable

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

## 🎨 Examples

### Wizard Form

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

async function validateStep(event) {
  if (event.from === 1 && !formData.name.trim()) {
    alert('Name is required')
    return false
  }
  return true
}
</script>
```

### Image Carousel

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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SequentialContainer } from '@sequential-ui/vue'

const currentImage = ref(0)
const images = [
  { id: 'img1', title: 'Nature', icon: '🌲' },
  { id: 'img2', title: 'Ocean', icon: '🌊' },
  { id: 'img3', title: 'Mountains', icon: '🏔️' }
]
</script>
```

## 📖 Documentation

- [Vue Components API](../../docs/api/vue-components.md) - Complete component reference
- [Vue Composables API](../../docs/api/vue-composables.md) - useNavigation composable
- [Getting Started Guide](../../docs/getting-started.md) - Core concepts and examples
- [Core Package Documentation](../core/README.md) - Framework-agnostic logic

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for development setup and guidelines.

## 📄 License

MIT © [Brenden Chu](https://github.com/brendenchu)