# Vue Composables

Vue 3 composables for Sequential UI providing reactive navigation state and methods.

## useNavigation

Main composable that wraps the core SequentialManager with Vue reactivity and lifecycle management.

### Signature

```typescript
function useNavigation(
  panels: Ref<SequentialPanelDefinition[]> | SequentialPanelDefinition[],
  initialPanel: number = 0,
  options: UseNavigationOptions = {}
): UseNavigationReturn
```

### Parameters

#### `panels`
- **Type:** `Ref<SequentialPanelDefinition[]> | SequentialPanelDefinition[]`
- **Description:** Array of panel definitions or a reactive ref containing the array

#### `initialPanel`
- **Type:** `number`
- **Default:** `0`
- **Description:** Starting panel index (zero-based)

#### `options`
- **Type:** `UseNavigationOptions`
- **Default:** `{}`
- **Description:** Configuration options for navigation behavior

### Options Interface

```typescript
interface UseNavigationOptions {
  loop?: boolean
  onBeforeNavigate?: (event: SequentialNavigationEvent) => boolean | Promise<boolean>
  onAfterNavigate?: (event: SequentialNavigationEvent) => void
}
```

- **`loop?: boolean`** - Enable loop navigation (default: `false`)
- **`onBeforeNavigate?: Function`** - Hook called before navigation (can block navigation)
- **`onAfterNavigate?: Function`** - Hook called after successful navigation

### Return Value

```typescript
interface UseNavigationReturn {
  // Reactive state
  currentPanel: Ref<number>
  totalPanels: Ref<number>
  canGoNext: Ref<boolean>
  canGoPrevious: Ref<boolean>
  isFirst: Ref<boolean>
  isLast: Ref<boolean>
  progress: Ref<number>
  isNavigating: Ref<boolean>
  
  // Methods
  next: () => Promise<boolean>
  previous: () => Promise<boolean>
  goTo: (index: number) => Promise<boolean>
  getCurrentPanel: () => SequentialPanelDefinition | null
  getPanel: (index: number) => SequentialPanelDefinition | null
  updatePanels: (panels: SequentialPanelDefinition[]) => void
  
  // Manager access
  manager: SequentialManager
}
```

#### Reactive State

All state properties are reactive Vue refs that automatically update when navigation occurs:

- **`currentPanel: Ref<number>`** - Current panel index (0-based)
- **`totalPanels: Ref<number>`** - Total number of panels
- **`canGoNext: Ref<boolean>`** - Whether next navigation is possible
- **`canGoPrevious: Ref<boolean>`** - Whether previous navigation is possible
- **`isFirst: Ref<boolean>`** - Whether currently on first panel
- **`isLast: Ref<boolean>`** - Whether currently on last panel
- **`progress: Ref<number>`** - Progress percentage (0-100)
- **`isNavigating: Ref<boolean>`** - Whether navigation is in progress

#### Navigation Methods

All navigation methods are async and return `Promise<boolean>` indicating success:

- **`next(): Promise<boolean>`** - Navigate to next panel
- **`previous(): Promise<boolean>`** - Navigate to previous panel
- **`goTo(index: number): Promise<boolean>`** - Navigate to specific panel by index

#### Panel Access Methods

- **`getCurrentPanel(): SequentialPanelDefinition | null`** - Get current panel data
- **`getPanel(index: number): SequentialPanelDefinition | null`** - Get panel by index
- **`updatePanels(panels: SequentialPanelDefinition[]): void`** - Update panels array

#### Manager Access

- **`manager: SequentialManager`** - Direct access to underlying manager for advanced use cases

## Usage Examples

### Basic Usage

```vue
<template>
  <div>
    <div class="panel">
      <h3>{{ currentPanelData?.title }}</h3>
      <p>Panel {{ navigation.currentPanel.value + 1 }} of {{ navigation.totalPanels.value }}</p>
      <div class="progress-bar">
        <div :style="{ width: `${navigation.progress.value}%` }" />
      </div>
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

### With Reactive Panels

```vue
<template>
  <div>
    <button @click="addPanel">Add Panel</button>
    <button @click="removePanel">Remove Panel</button>
    
    <div class="panel">
      <h3>{{ currentPanelData?.title }}</h3>
      <p>{{ navigation.currentPanel.value + 1 }} / {{ navigation.totalPanels.value }}</p>
    </div>
    
    <div class="controls">
      <button @click="navigation.previous" :disabled="!navigation.canGoPrevious.value">
        Previous
      </button>
      <button @click="navigation.next" :disabled="!navigation.canGoNext.value">
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNavigation } from '@sequential-ui/vue'

const panels = ref([
  { id: 'step-1', title: 'Step 1' },
  { id: 'step-2', title: 'Step 2' }
])

const navigation = useNavigation(panels, 0)

const currentPanelData = computed(() => navigation.getCurrentPanel())

function addPanel() {
  const newId = `step-${panels.value.length + 1}`
  panels.value.push({ id: newId, title: `Step ${panels.value.length + 1}` })
  navigation.updatePanels(panels.value)
}

function removePanel() {
  if (panels.value.length > 1) {
    panels.value.pop()
    navigation.updatePanels(panels.value)
  }
}
</script>
```

### With Validation

```vue
<template>
  <div>
    <div class="panel">
      <h3>{{ currentPanelData?.title }}</h3>
      
      <div v-if="navigation.currentPanel.value === 1" class="form">
        <input 
          v-model="formData.name" 
          placeholder="Enter your name"
          :class="{ error: hasError }"
        />
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      </div>
    </div>
    
    <div class="controls">
      <button @click="navigation.previous" :disabled="!navigation.canGoPrevious.value">
        Previous
      </button>
      <button @click="navigation.next" :disabled="!navigation.canGoNext.value">
        Next
      </button>
    </div>
    
    <div v-if="navigation.isNavigating.value" class="loading">
      Validating...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useNavigation } from '@sequential-ui/vue'
import type { SequentialNavigationEvent } from '@sequential-ui/core'

const formData = reactive({
  name: ''
})

const errorMessage = ref('')
const hasError = computed(() => !!errorMessage.value)

const panels = [
  { id: 'intro', title: 'Introduction' },
  { 
    id: 'form', 
    title: 'Enter Information',
    canNavigateFrom: async () => {
      errorMessage.value = ''
      
      if (!formData.name.trim()) {
        errorMessage.value = 'Name is required'
        return false
      }
      
      // Simulate async validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    }
  },
  { id: 'complete', title: 'Complete' }
]

const navigation = useNavigation(panels, 0, {
  onBeforeNavigate: async (event: SequentialNavigationEvent) => {
    console.log(`Before navigate: ${event.from} → ${event.to}`)
    return true
  },
  onAfterNavigate: (event: SequentialNavigationEvent) => {
    console.log(`After navigate: ${event.from} → ${event.to}`)
    errorMessage.value = '' // Clear errors on successful navigation
  }
})

const currentPanelData = computed(() => navigation.getCurrentPanel())
</script>
```

### Carousel/Slideshow Example

```vue
<template>
  <div class="carousel">
    <div class="slide">
      <img :src="currentSlide?.image" :alt="currentSlide?.title" />
      <div class="slide-info">
        <h3>{{ currentSlide?.title }}</h3>
        <p>{{ currentSlide?.description }}</p>
      </div>
    </div>
    
    <div class="carousel-controls">
      <button @click="navigation.previous" :disabled="!navigation.canGoPrevious.value">
        ←
      </button>
      <div class="indicators">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          @click="navigation.goTo(index)"
          :class="{ active: index === navigation.currentPanel.value }"
          class="indicator"
        />
      </div>
      <button @click="navigation.next" :disabled="!navigation.canGoNext.value">
        →
      </button>
    </div>
    
    <div class="auto-play">
      <button @click="toggleAutoPlay">
        {{ isAutoPlaying ? 'Pause' : 'Play' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useNavigation } from '@sequential-ui/vue'

const slides = [
  { id: 'slide1', title: 'Slide 1', description: 'First slide', image: '/img1.jpg' },
  { id: 'slide2', title: 'Slide 2', description: 'Second slide', image: '/img2.jpg' },
  { id: 'slide3', title: 'Slide 3', description: 'Third slide', image: '/img3.jpg' }
]

const navigation = useNavigation(slides, 0, {
  loop: true // Enable infinite scrolling
})

const currentSlide = computed(() => navigation.getCurrentPanel())

// Auto-play functionality
const isAutoPlaying = ref(false)
let autoPlayInterval: NodeJS.Timeout | null = null

function toggleAutoPlay() {
  isAutoPlaying.value = !isAutoPlaying.value
}

function startAutoPlay() {
  autoPlayInterval = setInterval(() => {
    navigation.next()
  }, 3000)
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

watch(isAutoPlaying, (playing) => {
  if (playing) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.carousel {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.slide img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #ccc;
  cursor: pointer;
  transition: background 0.2s;
}

.indicator.active {
  background: #007bff;
}
</style>
```

### Direct Manager Access

For advanced use cases, you can access the underlying SequentialManager:

```vue
<script setup lang="ts">
import { useNavigation } from '@sequential-ui/vue'

const navigation = useNavigation(panels)

// Access manager directly for advanced operations
const manager = navigation.manager

// Update configuration
manager.updateConfig({ loop: true })

// Get raw configuration
const config = manager.getConfig()

// Manual cleanup (usually not needed)
manager.destroy()
</script>
```

## Lifecycle Management

The `useNavigation` composable automatically handles Vue lifecycle:

- **Reactive Updates:** All state properties are reactive and update automatically
- **Cleanup:** Automatically calls `manager.destroy()` on component unmount
- **Event Binding:** Properly binds and unbinds navigation event handlers

## TypeScript Support

The composable provides full TypeScript support:

```typescript
import { useNavigation } from '@sequential-ui/vue'
import type { 
  UseNavigationOptions, 
  UseNavigationReturn,
  SequentialPanelDefinition 
} from '@sequential-ui/vue'

// Typed panel definitions
const panels: SequentialPanelDefinition[] = [
  { id: 'step1', title: 'Step 1' },
  { id: 'step2', title: 'Step 2' }
]

// Typed options
const options: UseNavigationOptions = {
  loop: true,
  onBeforeNavigate: async (event) => {
    // event is fully typed
    return true
  }
}

// Typed return value
const navigation: UseNavigationReturn = useNavigation(panels, 0, options)
```

## Related APIs

- [SequentialContainer](./vue-components.md) - Vue component using this composable
- [SequentialManager](./sequential-manager.md) - Underlying navigation manager
- [Core Types](./types.md) - TypeScript definitions