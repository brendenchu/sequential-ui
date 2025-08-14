<template>
  <div>
    <SequentialContainer
      :panels="imagePanels"
      v-model="currentImage"
      :loop="true"
      :show-controls="true"
      :show-indicators="true"
      container-class="bg-gray-100 rounded-lg overflow-hidden"
    >
      <template #panel="{ panel }">
        <div
          class="relative aspect-video bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"
        >
          <!-- Simulated Image -->
          <div class="text-center text-white">
            <div class="text-6xl mb-4">{{ panel?.emoji || "📷" }}</div>
            <h3 class="text-2xl font-bold mb-2">
              {{ panel?.title || "Image" }}
            </h3>
            <p class="text-blue-100">{{ panel?.description || "" }}</p>
          </div>

          <!-- Image overlay info -->
          <div
            class="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded"
          >
            {{ panel?.id || "image" }}
          </div>
        </div>
      </template>

      <template
        #controls="{
          canGoNext,
          canGoPrevious,
          next,
          previous,
          currentPanel,
          totalPanels,
        }"
      >
        <div class="flex items-center justify-between p-4 bg-white">
          <button
            @click="previous"
            :disabled="!canGoPrevious"
            class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon class="w-5 h-5 mr-1" />
            Previous
          </button>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              {{ currentPanel + 1 }} / {{ totalPanels }}
            </span>
            <button
              @click="toggleAutoPlay"
              :class="[
                'px-3 py-1 rounded text-sm font-medium',
                isAutoPlaying
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200',
              ]"
            >
              {{ isAutoPlaying ? "Pause" : "Play" }}
            </button>
          </div>

          <button
            @click="next"
            :disabled="!canGoNext"
            class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRightIcon class="w-5 h-5 ml-1" />
          </button>
        </div>
      </template>

      <template #indicators="{ currentPanel, totalPanels, goTo }">
        <div class="flex justify-center space-x-2 p-4 bg-white">
          <button
            v-for="(_, index) in Array(totalPanels)"
            :key="index"
            @click="goTo(index)"
            :class="[
              'w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              index === currentPanel
                ? 'bg-blue-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400',
            ]"
            :aria-label="`Go to image ${index + 1}`"
          />
        </div>
      </template>
    </SequentialContainer>

    <!-- Auto-play Controls -->
    <div class="mt-6 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Carousel Features</h4>
      <div class="space-y-2 text-sm text-gray-600">
        <div>✨ Loop navigation enabled</div>
        <div>⏯️ Auto-play functionality</div>
        <div>🎯 Clickable indicators</div>
        <div>📱 Touch/swipe support (coming soon)</div>
      </div>

      <div class="mt-4 space-y-2">
        <label class="flex items-center">
          <span class="text-sm font-medium text-gray-700 mr-3"
            >Auto-play speed:</span
          >
          <input
            type="range"
            v-model="autoPlaySpeed"
            min="1000"
            max="5000"
            step="500"
            class="flex-1"
          />
          <span class="text-sm text-gray-600 ml-2">{{ autoPlaySpeed }}ms</span>
        </label>
      </div>
    </div>

    <!-- Debug Info -->
    <div class="mt-4 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">State</h4>
      <div class="text-sm text-gray-600 space-y-1">
        <div>
          Current Image: {{ currentImage + 1 }} of {{ imagePanels.length }}
        </div>
        <div>Auto-playing: {{ isAutoPlaying ? "Yes" : "No" }}</div>
        <div>Speed: {{ autoPlaySpeed }}ms</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { SequentialContainer, useNavigation } from "@sequential-ui/vue";
import type { CarouselPanelDefinition } from "../types";

// Icons
const ChevronLeftIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`,
};

const ChevronRightIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`,
};

const currentImage = ref(0);
const isAutoPlaying = ref(false);
const autoPlaySpeed = ref(3000);
let autoPlayInterval: NodeJS.Timeout | null = null;

const imagePanels: CarouselPanelDefinition[] = [
  {
    id: "nature-1",
    title: "Mountain Vista",
    description: "Breathtaking mountain landscapes",
    emoji: "🏔️",
  },
  {
    id: "nature-2",
    title: "Ocean Waves",
    description: "Peaceful ocean scenery",
    emoji: "🌊",
  },
  {
    id: "nature-3",
    title: "Forest Path",
    description: "Serene forest walkways",
    emoji: "🌲",
  },
  {
    id: "nature-4",
    title: "Desert Sunset",
    description: "Golden desert horizons",
    emoji: "🌵",
  },
  {
    id: "nature-5",
    title: "Cherry Blossoms",
    description: "Beautiful spring flowers",
    emoji: "🌸",
  },
];

// Use navigation composable for auto-play
const navigation = useNavigation(imagePanels, currentImage.value, {
  loop: true,
});

// Sync with external currentImage ref
watch(currentImage, (newValue) => {
  navigation.goTo(newValue);
});

watch(
  () => navigation.currentPanel.value,
  (newValue) => {
    currentImage.value = newValue;
  },
);

function toggleAutoPlay() {
  isAutoPlaying.value = !isAutoPlaying.value;
}

function startAutoPlay() {
  if (autoPlayInterval) return;

  autoPlayInterval = setInterval(async () => {
    await navigation.next();
  }, autoPlaySpeed.value);
}

function stopAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

// Watch auto-play state
watch(isAutoPlaying, (playing) => {
  if (playing) {
    startAutoPlay();
  } else {
    stopAutoPlay();
  }
});

// Watch speed changes
watch(autoPlaySpeed, () => {
  if (isAutoPlaying.value) {
    stopAutoPlay();
    startAutoPlay();
  }
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>
