<template>
  <div>
    <SequentialContainer
      :panels="wizardPanels"
      v-model="currentPanel"
      :show-controls="true"
      :show-progress="true"
      :show-indicators="true"
    >
      <template #panel="{ panel, index, progress, isFirst, isLast }">
        <div class="p-8 text-center min-h-[300px] flex flex-col justify-center">
          <div class="mb-6">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <component :is="panel?.icon" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              {{ panel?.title || "Step" }}
            </h3>
            <p class="text-gray-600 max-w-md mx-auto">
              {{ panel?.description || "" }}
            </p>
          </div>

          <!-- Step-specific content -->
          <div class="flex-1 flex items-center justify-center">
            <div v-if="panel?.id === 'welcome'" class="text-center">
              <p class="text-lg text-gray-700 mb-4">
                Welcome to our setup wizard!
              </p>
              <p class="text-gray-600">
                We'll guide you through the configuration process.
              </p>
            </div>

            <div v-else-if="panel?.id === 'account'" class="w-full max-w-md">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Name</label
                  >
                  <input
                    type="text"
                    v-model="formData.name"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    type="email"
                    v-model="formData.email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            <div
              v-else-if="panel?.id === 'preferences'"
              class="w-full max-w-md"
            >
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Theme</label
                  >
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="formData.theme"
                        value="light"
                        class="mr-2"
                      />
                      Light
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        v-model="formData.theme"
                        value="dark"
                        class="mr-2"
                      />
                      Dark
                    </label>
                  </div>
                </div>
                <div>
                  <label class="flex items-center">
                    <input
                      type="checkbox"
                      v-model="formData.notifications"
                      class="mr-2"
                    />
                    Enable notifications
                  </label>
                </div>
              </div>
            </div>

            <div v-else-if="panel?.id === 'review'" class="w-full max-w-md">
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between">
                  <span class="font-medium">Name:</span>
                  <span>{{ formData.name || "Not provided" }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Email:</span>
                  <span>{{ formData.email || "Not provided" }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Theme:</span>
                  <span>{{ formData.theme || "Not selected" }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium">Notifications:</span>
                  <span>{{
                    formData.notifications ? "Enabled" : "Disabled"
                  }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="panel?.id === 'complete'" class="text-center">
              <div
                class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckIcon class="w-8 h-8 text-green-600" />
              </div>
              <p class="text-lg text-gray-700 mb-2">Setup Complete!</p>
              <p class="text-gray-600">
                Your account has been configured successfully.
              </p>
            </div>
          </div>
        </div>
      </template>
    </SequentialContainer>

    <!-- Debug Info -->
    <div class="mt-6 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Wizard State</h4>
      <div class="text-sm text-gray-600 space-y-1">
        <div>
          Current Panel: {{ currentPanel + 1 }} of {{ wizardPanels.length }}
        </div>
        <div>Form Data: {{ JSON.stringify(formData, null, 2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SequentialContainer } from "@sequential-ui/vue";
import type { PlaygroundPanelDefinition } from "../types";

// Icons (using heroicons outline)
const UserIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`,
};

const CogIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
};

const ClipboardIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>`,
};

const CheckIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
};

const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`,
};

const currentPanel = ref(0);

const formData = ref({
  name: "",
  email: "",
  theme: "light",
  notifications: true,
});

const wizardPanels: PlaygroundPanelDefinition[] = [
  {
    id: "welcome",
    title: "Welcome",
    description: "Let's get started with your setup",
    icon: HomeIcon,
  },
  {
    id: "account",
    title: "Account Information",
    description: "Tell us about yourself",
    icon: UserIcon,
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Customize your experience",
    icon: CogIcon,
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm your settings",
    icon: ClipboardIcon,
  },
  {
    id: "complete",
    title: "Complete",
    description: "All done!",
    icon: CheckIcon,
  },
];
</script>
