<template>
  <div>
    <SequentialContainer
      :panels="validationPanels"
      v-model="currentPanel"
      :show-controls="true"
      :show-progress="true"
      :show-indicators="true"
      :on-before-navigate="handleBeforeNavigate"
      :on-after-navigate="handleAfterNavigate"
    >
      <template #panel="{ panel, index }">
        <div class="p-6 min-h-[400px]">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ panel?.title || "Step" }}
            </h3>
            <p class="text-gray-600">{{ panel?.description || "" }}</p>
          </div>

          <!-- Panel-specific content -->
          <div class="max-w-md mx-auto">
            <!-- Start Panel -->
            <div v-if="panel?.id === 'start'" class="text-center space-y-4">
              <div class="text-6xl">🚀</div>
              <p class="text-gray-700">
                This demo shows different validation scenarios. Try navigating
                to see how validation works!
              </p>
            </div>

            <!-- Basic Validation Panel -->
            <div v-else-if="panel?.id === 'basic-validation'" class="space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-blue-700 text-sm">
                  <strong>Validation Rule:</strong> You must enter a name to
                  proceed.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Your Name *</label
                >
                <input
                  type="text"
                  v-model="userInput.name"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    validationErrors.name
                      ? 'border-red-300'
                      : 'border-gray-300',
                  ]"
                  placeholder="Enter your name"
                />
                <p
                  v-if="validationErrors.name"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ validationErrors.name }}
                </p>
              </div>
            </div>

            <!-- Async Validation Panel -->
            <div v-else-if="panel?.id === 'async-validation'" class="space-y-4">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-700 text-sm">
                  <strong>Async Validation:</strong> This simulates checking
                  username availability (2 second delay).
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Username *</label
                >
                <div class="relative">
                  <input
                    type="text"
                    v-model="userInput.username"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      validationErrors.username
                        ? 'border-red-300'
                        : 'border-gray-300',
                    ]"
                    placeholder="Enter a username"
                  />
                  <div
                    v-if="isValidatingUsername"
                    class="absolute right-3 top-2.5"
                  >
                    <div
                      class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                    ></div>
                  </div>
                </div>
                <p
                  v-if="validationErrors.username"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ validationErrors.username }}
                </p>
                <p
                  v-else-if="userInput.username"
                  class="mt-1 text-sm text-gray-500"
                >
                  Try "admin" or "test" to see validation errors
                </p>
              </div>
            </div>

            <!-- Conditional Panel -->
            <div v-else-if="panel?.id === 'conditional'" class="space-y-4">
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p class="text-purple-700 text-sm">
                  <strong>Conditional Access:</strong> This panel is only
                  accessible if you're a "premium" user.
                </p>
              </div>

              <div class="text-center">
                <div class="text-6xl mb-4">💎</div>
                <p class="text-gray-700">
                  Congratulations! You have premium access.
                </p>
              </div>
            </div>

            <!-- Disabled Panel -->
            <div v-else-if="panel?.id === 'disabled'" class="space-y-4">
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="text-gray-600 text-sm">
                  <strong>Disabled Panel:</strong> This panel is completely
                  disabled and cannot be accessed.
                </p>
              </div>

              <div class="text-center">
                <div class="text-6xl mb-4">🚫</div>
                <p class="text-gray-700">This content is not available.</p>
              </div>
            </div>

            <!-- Success Panel -->
            <div
              v-else-if="panel?.id === 'success'"
              class="text-center space-y-4"
            >
              <div class="text-6xl">✅</div>
              <p class="text-gray-700">
                Great! You've successfully navigated through all the validation
                scenarios.
              </p>
              <button
                @click="resetDemo"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset Demo
              </button>
            </div>
          </div>
        </div>
      </template>
    </SequentialContainer>

    <!-- Validation Controls -->
    <div class="mt-6 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-3">Validation Controls</h4>

      <div class="space-y-3">
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="userSettings.isPremium"
            class="mr-2"
          />
          <span class="text-sm text-gray-700"
            >Premium User (allows access to conditional panel)</span
          >
        </label>

        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="userSettings.enableAsyncDelay"
            class="mr-2"
          />
          <span class="text-sm text-gray-700"
            >Enable async validation delay</span
          >
        </label>
      </div>
    </div>

    <!-- Navigation Log -->
    <div class="mt-4 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Navigation Log</h4>
      <div class="max-h-32 overflow-y-auto">
        <div
          v-for="(log, index) in navigationLog"
          :key="index"
          class="text-xs text-gray-600 py-1"
        >
          <span class="font-mono">{{ log.timestamp }}</span> - {{ log.message }}
        </div>
      </div>
      <button
        @click="navigationLog = []"
        class="mt-2 text-xs text-blue-600 hover:text-blue-800"
      >
        Clear Log
      </button>
    </div>

    <!-- Debug Info -->
    <div class="mt-4 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Current State</h4>
      <div class="text-sm text-gray-600 space-y-1">
        <div>
          Current Panel: {{ currentPanel + 1 }} of {{ validationPanels.length }}
        </div>
        <div>User Input: {{ JSON.stringify(userInput) }}</div>
        <div>Settings: {{ JSON.stringify(userSettings) }}</div>
        <div>
          Validation Errors:
          {{
            Object.keys(validationErrors).length > 0
              ? JSON.stringify(validationErrors)
              : "None"
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { SequentialContainer } from "@sequential-ui/vue";
import type { SequentialNavigationEvent } from "@sequential-ui/core";
import type { PlaygroundPanelDefinition } from "../types";

const currentPanel = ref(0);
const isValidatingUsername = ref(false);

const userInput = reactive({
  name: "",
  username: "",
});

const userSettings = reactive({
  isPremium: false,
  enableAsyncDelay: true,
});

const validationErrors = reactive<Record<string, string>>({});

const navigationLog = ref<Array<{ timestamp: string; message: string }>>([]);

const validationPanels: PlaygroundPanelDefinition[] = [
  {
    id: "start",
    title: "Validation Demo",
    description: "Learn about different validation patterns",
  },
  {
    id: "basic-validation",
    title: "Basic Validation",
    description: "Simple required field validation",
    canNavigateFrom: async () => {
      // Clear previous errors
      delete validationErrors.name;

      if (!userInput.name.trim()) {
        validationErrors.name = "Name is required to proceed";
        addLog("Navigation blocked: Name is required");
        return false;
      }

      addLog("Basic validation passed");
      return true;
    },
  },
  {
    id: "async-validation",
    title: "Async Validation",
    description: "Simulated server-side validation",
    canNavigateFrom: async () => {
      // Clear previous errors
      delete validationErrors.username;

      if (!userInput.username.trim()) {
        validationErrors.username = "Username is required";
        addLog("Navigation blocked: Username is required");
        return false;
      }

      // Simulate async validation
      isValidatingUsername.value = true;
      addLog("Starting async username validation...");

      try {
        if (userSettings.enableAsyncDelay) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Simulate server response
        const takenUsernames = ["admin", "test", "user"];
        if (takenUsernames.includes(userInput.username.toLowerCase())) {
          validationErrors.username = "Username is already taken";
          addLog("Navigation blocked: Username already taken");
          return false;
        }

        addLog("Async validation passed");
        return true;
      } finally {
        isValidatingUsername.value = false;
      }
    },
  },
  {
    id: "conditional",
    title: "Premium Content",
    description: "Only available to premium users",
    canNavigateTo: async () => {
      if (!userSettings.isPremium) {
        addLog("Navigation blocked: Premium access required");
        return false;
      }

      addLog("Conditional access granted");
      return true;
    },
  },
  {
    id: "disabled",
    title: "Disabled Content",
    description: "This panel is completely disabled",
    disabled: true,
  },
  {
    id: "success",
    title: "Complete",
    description: "All validation scenarios completed",
  },
];

async function handleBeforeNavigate(
  event: SequentialNavigationEvent,
): Promise<boolean> {
  addLog(`Before navigate: ${event.from} → ${event.to} (${event.direction})`);
  return true;
}

function handleAfterNavigate(event: SequentialNavigationEvent) {
  addLog(`After navigate: ${event.from} → ${event.to} (${event.direction})`);
}

function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  navigationLog.value.push({ timestamp, message });

  // Keep only last 20 log entries
  if (navigationLog.value.length > 20) {
    navigationLog.value = navigationLog.value.slice(-20);
  }
}

function resetDemo() {
  currentPanel.value = 0;
  userInput.name = "";
  userInput.username = "";
  Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);
  navigationLog.value = [];
  addLog("Demo reset");
}
</script>
