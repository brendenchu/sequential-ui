<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Sequential UI Playground</h1>
        <p class="text-lg text-gray-600 mb-6">
          Interactive examples showcasing Sequential UI components
        </p>
        <div class="flex justify-center space-x-4 mb-8">
          <button
            v-for="example in examples"
            :key="example.id"
            @click="currentExample = example.id"
            :class="[
              'px-6 py-2 rounded-lg font-medium transition-colors',
              currentExample === example.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100',
            ]"
          >
            {{ example.name }}
          </button>
        </div>
      </div>

      <!-- Current Example -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ currentExampleData?.name }}
        </h2>
        <p class="text-gray-600 mb-6">{{ currentExampleData?.description }}</p>

        <!-- Example Content -->
        <BasicWizardExample v-if="currentExample === 'wizard'" />
        <ImageCarouselExample v-else-if="currentExample === 'carousel'" />
        <FormStepperExample v-else-if="currentExample === 'form'" />
        <ValidationExample v-else-if="currentExample === 'validation'" />
      </div>

      <!-- Debug Panel -->
      <div class="mt-8 bg-gray-800 text-white rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Debug Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><strong>Sequential UI Version:</strong> 0.1.0</div>
          <div><strong>Vue Version:</strong> {{ vueVersion }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, version as vueVersion } from 'vue'
import BasicWizardExample from './examples/BasicWizardExample.vue'
import ImageCarouselExample from './examples/ImageCarouselExample.vue'
import FormStepperExample from './examples/FormStepperExample.vue'
import ValidationExample from './examples/ValidationExample.vue'

const currentExample = ref('wizard')

const examples = [
  {
    id: 'wizard',
    name: 'Basic Wizard',
    description: 'A simple multi-step wizard with navigation controls',
  },
  {
    id: 'carousel',
    name: 'Image Carousel',
    description: 'An image carousel with loop navigation and indicators',
  },
  {
    id: 'form',
    name: 'Form Stepper',
    description: 'A multi-step form with validation and progress tracking',
  },
  {
    id: 'validation',
    name: 'Validation Demo',
    description: 'Demonstrates panel validation and conditional navigation',
  },
]

const currentExampleData = computed(() => {
  return examples.find(example => example.id === currentExample.value)
})
</script>
