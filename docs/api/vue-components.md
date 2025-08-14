# Vue Components

Vue 3 components for Sequential UI with Composition API and TypeScript support.

## SequentialContainer

The main container component that orchestrates sequential navigation and renders panels.

### Props

```typescript
interface SequentialContainerProps {
  panels: SequentialPanelDefinition[]
  modelValue?: number
  loop?: boolean
  showControls?: boolean
  showProgress?: boolean
  showIndicators?: boolean
  containerClass?: string
  panelsClass?: string
  controlsClass?: string
  indicatorsClass?: string
  onBeforeNavigate?: (event: SequentialNavigationEvent) => boolean | Promise<boolean>
  onAfterNavigate?: (event: SequentialNavigationEvent) => void
}
```

#### Required Props

- **`panels: SequentialPanelDefinition[]`** - Array of panel definitions to navigate through

#### Optional Props

- **`modelValue?: number`** (default: `0`) - Current panel index for v-model support
- **`loop?: boolean`** (default: `false`) - Enable loop navigation (last → first, first → last)
- **`showControls?: boolean`** (default: `true`) - Show default navigation controls
- **`showProgress?: boolean`** (default: `false`) - Show progress bar in controls
- **`showIndicators?: boolean`** (default: `false`) - Show panel indicators (dots)
- **`containerClass?: string`** - Additional CSS classes for container
- **`panelsClass?: string`** - Additional CSS classes for panels wrapper
- **`controlsClass?: string`** - Additional CSS classes for controls wrapper
- **`indicatorsClass?: string`** - Additional CSS classes for indicators wrapper
- **`onBeforeNavigate?: Function`** - Hook called before navigation (can block navigation)
- **`onAfterNavigate?: Function`** - Hook called after successful navigation

### Events

```typescript
interface SequentialContainerEmits {
  'update:modelValue': [value: number]
  'navigate': [event: { from: number, to: number, panel: SequentialPanelDefinition | null }]
}
```

- **`update:modelValue`** - Emitted when current panel changes (for v-model)
- **`navigate`** - Emitted after successful navigation with event details

### Slots

#### Default Panel Slot

```vue
<template #panel="{ panel, index, isFirst, isLast, progress, canGoNext, canGoPrevious, next, previous, goTo }">
  <!-- Your panel content -->
</template>
```

**Slot Props:**
- `panel: SequentialPanelDefinition` - Current panel data
- `index: number` - Current panel index
- `isFirst: boolean` - Whether on first panel
- `isLast: boolean` - Whether on last panel
- `progress: number` - Progress percentage (0-100)
- `canGoNext: boolean` - Whether next navigation is possible
- `canGoPrevious: boolean` - Whether previous navigation is possible
- `next: () => Promise<boolean>` - Navigate to next panel
- `previous: () => Promise<boolean>` - Navigate to previous panel
- `goTo: (index: number) => Promise<boolean>` - Navigate to specific panel

#### Controls Slot

```vue
<template #controls="{ currentPanel, totalPanels, canGoNext, canGoPrevious, isFirst, isLast, progress, next, previous, goTo }">
  <!-- Custom navigation controls -->
</template>
```

**Slot Props:**
- `currentPanel: number` - Current panel index
- `totalPanels: number` - Total number of panels
- `canGoNext: boolean` - Whether next navigation is possible
- `canGoPrevious: boolean` - Whether previous navigation is possible
- `isFirst: boolean` - Whether on first panel
- `isLast: boolean` - Whether on last panel
- `progress: number` - Progress percentage (0-100)
- `next: () => Promise<boolean>` - Navigate to next panel
- `previous: () => Promise<boolean>` - Navigate to previous panel
- `goTo: (index: number) => Promise<boolean>` - Navigate to specific panel

#### Indicators Slot

```vue
<template #indicators="{ currentPanel, totalPanels, panels, goTo }">
  <!-- Custom indicators -->
</template>
```

**Slot Props:**
- `currentPanel: number` - Current panel index
- `totalPanels: number` - Total number of panels
- `panels: SequentialPanelDefinition[]` - All panel definitions
- `goTo: (index: number) => Promise<boolean>` - Navigate to specific panel

### Template Ref

Access navigation methods and state via template ref:

```vue
<template>
  <SequentialContainer ref="sequentialRef" :panels="panels" />
  <button @click="goToLast">Go to Last Panel</button>
</template>

<script setup>
import { ref } from 'vue'

const sequentialRef = ref()

function goToLast() {
  const totalPanels = sequentialRef.value.totalPanels.value
  sequentialRef.value.goTo(totalPanels - 1)
}
</script>
```

**Exposed Methods & Properties:**
- `navigation` - Full navigation composable return
- `currentPanel: Ref<number>` - Current panel index
- `totalPanels: Ref<number>` - Total number of panels
- `canGoNext: Ref<boolean>` - Next navigation capability
- `canGoPrevious: Ref<boolean>` - Previous navigation capability
- `isFirst: Ref<boolean>` - First panel state
- `isLast: Ref<boolean>` - Last panel state
- `progress: Ref<number>` - Progress percentage
- `next: () => Promise<boolean>` - Navigate next
- `previous: () => Promise<boolean>` - Navigate previous
- `goTo: (index: number) => Promise<boolean>` - Navigate to index
- `getCurrentPanel: () => SequentialPanelDefinition | null` - Get current panel
- `getPanel: (index: number) => SequentialPanelDefinition | null` - Get panel by index

## Usage Examples

### Basic Setup

```vue
<template>
  <SequentialContainer :panels="panels" v-model="currentPanel">
    <template #panel="{ panel, index }">
      <div class="p-6 text-center">
        <h3 class="text-xl font-bold mb-2">{{ panel.title }}</h3>
        <p class="text-gray-600">Panel {{ index + 1 }} content</p>
      </div>
    </template>
  </SequentialContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SequentialContainer } from '@sequential-ui/vue'

const currentPanel = ref(0)
const panels = [
  { id: 'step-1', title: 'Welcome' },
  { id: 'step-2', title: 'Setup' },
  { id: 'step-3', title: 'Complete' }
]
</script>
```

### With Custom Controls

```vue
<template>
  <SequentialContainer 
    :panels="panels" 
    v-model="currentPanel"
    :show-controls="false"
  >
    <template #panel="{ panel }">
      <div class="p-6">
        <h3>{{ panel.title }}</h3>
        <p>{{ panel.content }}</p>
      </div>
    </template>
    
    <template #controls="{ canGoNext, canGoPrevious, next, previous, progress }">
      <div class="flex justify-between items-center p-4 border-t">
        <button 
          @click="previous" 
          :disabled="!canGoPrevious"
          class="btn btn-secondary"
        >
          Back
        </button>
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">{{ Math.round(progress) }}% complete</span>
          <div class="w-32 h-2 bg-gray-200 rounded-full">
            <div 
              class="h-2 bg-blue-600 rounded-full transition-all"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
        
        <button 
          @click="next" 
          :disabled="!canGoNext"
          class="btn btn-primary"
        >
          Next
        </button>
      </div>
    </template>
  </SequentialContainer>
</template>
```

### With Validation

```vue
<template>
  <SequentialContainer 
    :panels="panels" 
    v-model="currentPanel"
    :on-before-navigate="validateNavigation"
    :on-after-navigate="handleNavigation"
  >
    <template #panel="{ panel, index }">
      <div class="p-6">
        <h3>{{ panel.title }}</h3>
        
        <div v-if="panel.id === 'form'" class="mt-4">
          <input 
            v-model="formData.name" 
            placeholder="Enter your name"
            class="w-full p-2 border rounded"
          />
          <p v-if="errors.name" class="text-red-600 text-sm mt-1">
            {{ errors.name }}
          </p>
        </div>
      </div>
    </template>
  </SequentialContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SequentialContainer } from '@sequential-ui/vue'
import type { SequentialNavigationEvent } from '@sequential-ui/core'

const currentPanel = ref(0)
const formData = reactive({ name: '' })
const errors = reactive<{ name?: string }>({})

const panels = [
  { id: 'intro', title: 'Introduction' },
  { id: 'form', title: 'Form Step' },
  { id: 'complete', title: 'Complete' }
]

async function validateNavigation(event: SequentialNavigationEvent): Promise<boolean> {
  // Validate when leaving form panel
  if (event.from === 1 && !formData.name.trim()) {
    errors.name = 'Name is required'
    return false
  }
  
  errors.name = undefined
  return true
}

function handleNavigation(event: SequentialNavigationEvent) {
  console.log(`Navigated from ${event.from} to ${event.to}`)
}
</script>
```

### Carousel Example

```vue
<template>
  <SequentialContainer
    :panels="images"
    v-model="currentImage"
    :loop="true"
    :show-indicators="true"
    container-class="bg-gray-100 rounded-lg overflow-hidden"
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
      <div class="absolute inset-y-0 left-0 flex items-center">
        <button 
          @click="previous"
          :disabled="!canGoPrevious"
          class="ml-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
        >
          ←
        </button>
      </div>
      <div class="absolute inset-y-0 right-0 flex items-center">
        <button 
          @click="next"
          :disabled="!canGoNext"
          class="mr-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
        >
          →
        </button>
      </div>
    </template>
  </SequentialContainer>
</template>

<script setup lang="ts">
const currentImage = ref(0)
const images = [
  { id: 'img1', title: 'Nature', icon: '🌲' },
  { id: 'img2', title: 'Ocean', icon: '🌊' },
  { id: 'img3', title: 'Mountains', icon: '🏔️' }
]
</script>
```

## Styling

Sequential UI Vue components use Tailwind CSS classes by default but can be fully customized:

### Default Classes

The component applies these default classes:

```css
.sequential-container { @apply w-full; }
.sequential-panels { @apply w-full; }
.sequential-controls { @apply mt-4 w-full; }
.sequential-indicators { @apply w-full; }
```

### Custom Styling

Override styles using class props or CSS:

```vue
<SequentialContainer
  :panels="panels"
  container-class="my-custom-container"
  panels-class="my-custom-panels"
  controls-class="my-custom-controls"
  indicators-class="my-custom-indicators"
/>
```

```css
.my-custom-container {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
}

.my-custom-controls {
  background: #f9fafb;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}
```

## Related APIs

- [useNavigation Composable](./vue-composables.md) - Direct access to navigation logic
- [Core Types](./types.md) - TypeScript definitions
- [SequentialManager](./sequential-manager.md) - Underlying navigation manager