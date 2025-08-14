<template>
  <div class="sequential-container" :class="containerClass">
    <!-- Panel Content -->
    <div class="sequential-panels" :class="panelsClass">
      <slot
        name="panel"
        :panel="currentPanelData"
        :index="navigation.currentPanel.value"
        :isFirst="navigation.isFirst.value"
        :isLast="navigation.isLast.value"
        :progress="navigation.progress.value"
        :canGoNext="navigation.canGoNext.value"
        :canGoPrevious="navigation.canGoPrevious.value"
        :next="navigation.next"
        :previous="navigation.previous"
        :goTo="navigation.goTo"
      >
        <!-- Default panel content if no slot provided -->
        <div class="sequential-panel-default">
          <h3 class="text-lg font-medium mb-2">{{ currentPanelData?.id }}</h3>
          <p class="text-gray-600">
            Panel {{ navigation.currentPanel.value + 1 }} of
            {{ navigation.totalPanels.value }}
          </p>
        </div>
      </slot>
    </div>

    <!-- Optional Controls -->
    <div v-if="showControls" class="sequential-controls" :class="controlsClass">
      <slot
        name="controls"
        :currentPanel="navigation.currentPanel.value"
        :totalPanels="navigation.totalPanels.value"
        :canGoNext="navigation.canGoNext.value"
        :canGoPrevious="navigation.canGoPrevious.value"
        :isFirst="navigation.isFirst.value"
        :isLast="navigation.isLast.value"
        :progress="navigation.progress.value"
        :next="navigation.next"
        :previous="navigation.previous"
        :goTo="navigation.goTo"
      >
        <!-- Default controls -->
        <div class="flex items-center justify-between">
          <button
            @click="navigation.previous"
            :disabled="!navigation.canGoPrevious.value"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">
              {{ navigation.currentPanel.value + 1 }} of
              {{ navigation.totalPanels.value }}
            </span>
            <div v-if="showProgress" class="flex items-center">
              <span class="text-sm text-gray-500 mr-2"
                >{{ Math.round(navigation.progress.value) }}%</span
              >
              <div class="w-20 h-2 bg-gray-200 rounded-full">
                <div
                  class="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  :style="{ width: `${navigation.progress.value}%` }"
                ></div>
              </div>
            </div>
          </div>

          <button
            @click="navigation.next"
            :disabled="!navigation.canGoNext.value"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </slot>
    </div>

    <!-- Optional Indicators -->
    <div v-if="showIndicators" class="sequential-indicators" :class="indicatorsClass">
      <slot
        name="indicators"
        :currentPanel="navigation.currentPanel.value"
        :totalPanels="navigation.totalPanels.value"
        :panels="panels"
        :goTo="navigation.goTo"
      >
        <!-- Default indicators (dots) -->
        <div class="flex justify-center space-x-2 mt-4">
          <button
            v-for="(panel, index) in panels"
            :key="panel.id"
            @click="navigation.goTo(index)"
            :class="[
              'w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              index === navigation.currentPanel.value
                ? 'bg-blue-600'
                : 'bg-gray-300 hover:bg-gray-400',
            ]"
            :aria-label="`Go to panel ${index + 1}`"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SequentialPanelDefinition } from '@sequential-ui/core'
import { useNavigation } from '../composables/useNavigation'
import type { UseNavigationOptions } from '../composables/useNavigation'

export interface SequentialContainerProps {
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
  onBeforeNavigate?: UseNavigationOptions['onBeforeNavigate']
  onAfterNavigate?: UseNavigationOptions['onAfterNavigate']
}

export interface SequentialContainerEmits {
  'update:modelValue': [value: number]
  navigate: [
    event: {
      from: number
      to: number
      panel: SequentialPanelDefinition | null
    },
  ]
}

const props = withDefaults(defineProps<SequentialContainerProps>(), {
  modelValue: 0,
  loop: false,
  showControls: true,
  showProgress: false,
  showIndicators: false,
  containerClass: '',
  panelsClass: '',
  controlsClass: '',
  indicatorsClass: '',
})

const emit = defineEmits<SequentialContainerEmits>()

// Navigation composable with event handling
const navigation = useNavigation(props.panels, props.modelValue, {
  loop: props.loop,
  onBeforeNavigate: props.onBeforeNavigate,
  onAfterNavigate: event => {
    // Update v-model
    emit('update:modelValue', event.to)

    // Emit navigation event
    emit('navigate', {
      from: event.from,
      to: event.to,
      panel: event.panel,
    })

    // Call user handler
    if (props.onAfterNavigate) {
      props.onAfterNavigate(event)
    }
  },
})

// Computed current panel data
const currentPanelData = computed(() => {
  return navigation.getCurrentPanel()
})

// Watch for external model value changes
// Note: This would ideally use a watcher but keeping it simple for now
// Users can control navigation through the navigation methods

// Expose navigation methods and state for template refs
defineExpose({
  navigation,
  currentPanel: navigation.currentPanel,
  totalPanels: navigation.totalPanels,
  canGoNext: navigation.canGoNext,
  canGoPrevious: navigation.canGoPrevious,
  isFirst: navigation.isFirst,
  isLast: navigation.isLast,
  progress: navigation.progress,
  next: navigation.next,
  previous: navigation.previous,
  goTo: navigation.goTo,
  getCurrentPanel: navigation.getCurrentPanel,
  getPanel: navigation.getPanel,
})
</script>

<style scoped>
.sequential-container {
  @apply w-full;
}

.sequential-panels {
  @apply w-full;
}

.sequential-controls {
  @apply mt-4 w-full;
}

.sequential-indicators {
  @apply w-full;
}

.sequential-panel-default {
  @apply p-6 text-center;
}
</style>
