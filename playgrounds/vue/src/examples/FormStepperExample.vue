<template>
  <div>
    <SequentialContainer
      ref="sequentialContainer"
      :panels="formPanels"
      v-model="currentStep"
      :show-controls="false"
      :show-progress="true"
      :show-indicators="false"
    >
      <template
        #panel="{
          panel,
          index,
          isFirst,
          isLast,
          next,
          previous,
          canGoNext,
          canGoPrevious,
        }"
      >
        <div class="p-6">
          <!-- Step Header -->
          <div class="mb-6">
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <div class="flex items-center">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                      'bg-blue-600 text-white',
                    ]"
                  >
                    {{ index + 1 }}
                  </div>
                  <h3 class="ml-3 text-lg font-medium text-gray-900">
                    {{ panel?.title || "Step" }}
                  </h3>
                </div>
              </div>
            </div>
            <p class="text-gray-600">{{ panel?.description || "" }}</p>
          </div>

          <!-- Step Content -->
          <div class="min-h-[300px]">
            <!-- Personal Information -->
            <div v-if="panel?.id === 'personal'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >First Name *</label
                  >
                  <input
                    type="text"
                    v-model="formData.firstName"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      formErrors.firstName
                        ? 'border-red-300'
                        : 'border-gray-300',
                    ]"
                    placeholder="Enter your first name"
                  />
                  <p
                    v-if="formErrors.firstName"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ formErrors.firstName }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Last Name *</label
                  >
                  <input
                    type="text"
                    v-model="formData.lastName"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      formErrors.lastName
                        ? 'border-red-300'
                        : 'border-gray-300',
                    ]"
                    placeholder="Enter your last name"
                  />
                  <p
                    v-if="formErrors.lastName"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ formErrors.lastName }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Email Address *</label
                >
                <input
                  type="email"
                  v-model="formData.email"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    formErrors.email ? 'border-red-300' : 'border-gray-300',
                  ]"
                  placeholder="Enter your email address"
                />
                <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">
                  {{ formErrors.email }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Phone Number</label
                >
                <input
                  type="tel"
                  v-model="formData.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <!-- Address Information -->
            <div v-else-if="panel?.id === 'address'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Street Address *</label
                >
                <input
                  type="text"
                  v-model="formData.address"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    formErrors.address ? 'border-red-300' : 'border-gray-300',
                  ]"
                  placeholder="Enter your street address"
                />
                <p v-if="formErrors.address" class="mt-1 text-sm text-red-600">
                  {{ formErrors.address }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >City *</label
                  >
                  <input
                    type="text"
                    v-model="formData.city"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      formErrors.city ? 'border-red-300' : 'border-gray-300',
                    ]"
                    placeholder="Enter city"
                  />
                  <p v-if="formErrors.city" class="mt-1 text-sm text-red-600">
                    {{ formErrors.city }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >State/Province *</label
                  >
                  <input
                    type="text"
                    v-model="formData.state"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      formErrors.state ? 'border-red-300' : 'border-gray-300',
                    ]"
                    placeholder="Enter state"
                  />
                  <p v-if="formErrors.state" class="mt-1 text-sm text-red-600">
                    {{ formErrors.state }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >ZIP Code *</label
                  >
                  <input
                    type="text"
                    v-model="formData.zipCode"
                    :class="[
                      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                      formErrors.zipCode ? 'border-red-300' : 'border-gray-300',
                    ]"
                    placeholder="Enter ZIP"
                  />
                  <p
                    v-if="formErrors.zipCode"
                    class="mt-1 text-sm text-red-600"
                  >
                    {{ formErrors.zipCode }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Country *</label
                >
                <select
                  v-model="formData.country"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                    formErrors.country ? 'border-red-300' : 'border-gray-300',
                  ]"
                >
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
                <p v-if="formErrors.country" class="mt-1 text-sm text-red-600">
                  {{ formErrors.country }}
                </p>
              </div>
            </div>

            <!-- Review -->
            <div v-else-if="panel?.id === 'review'" class="space-y-6">
              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">
                  Personal Information
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span class="font-medium">Name:</span>
                    {{ formData.firstName }} {{ formData.lastName }}
                  </div>
                  <div>
                    <span class="font-medium">Email:</span> {{ formData.email }}
                  </div>
                  <div>
                    <span class="font-medium">Phone:</span>
                    {{ formData.phone || "Not provided" }}
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-3">
                  Address Information
                </h4>
                <div class="text-sm space-y-1">
                  <div>{{ formData.address }}</div>
                  <div>
                    {{ formData.city }}, {{ formData.state }}
                    {{ formData.zipCode }}
                  </div>
                  <div>{{ getCountryName(formData.country) }}</div>
                </div>
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-3 text-sm text-blue-700">
                    Please review your information carefully before submitting.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Controls -->
          <div class="flex justify-between pt-6 border-t border-gray-200">
            <button
              v-if="!isFirst"
              @click="previous"
              :disabled="!canGoPrevious"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div v-else></div>

            <button
              v-if="!isLast"
              @click="handleNext(next)"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue
            </button>
            <button
              v-else
              @click="submitForm"
              class="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit Form
            </button>
          </div>
        </div>
      </template>
    </SequentialContainer>

    <!-- Form State Debug -->
    <div class="mt-6 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Form Validation (Direct Navigation)</h4>
      <div class="text-sm text-gray-600 space-y-1">
        <div>
          <strong>Navigation:</strong> {{ localNavigation.currentPanel.value + 1 }} of {{ localNavigation.totalPanels.value }}
        </div>
        <div>
          <strong>Progress:</strong> {{ Math.round(localNavigation.progress.value) }}%
        </div>
        <div>
          <strong>Can Go Next:</strong> {{ localNavigation.canGoNext.value ? 'Yes' : 'No' }}
        </div>
        <div>
          <strong>Can Go Previous:</strong> {{ localNavigation.canGoPrevious.value ? 'Yes' : 'No' }}
        </div>
        <div>
          <strong>Current Panel ID:</strong> {{ localNavigation.currentPanelData.value?.id || 'None' }}
        </div>
        <div>
          <strong>Current Step:</strong> {{ currentStep + 1 }} of {{ formPanels.length }}
        </div>
        <div>Validation Errors: {{ Object.keys(formErrors).length }}</div>
        <div v-if="Object.keys(formErrors).length > 0" class="text-red-600">
          Errors: {{ Object.keys(formErrors).join(", ") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { SequentialContainer, useNavigation } from "@sequential-ui/vue";
import type { FormPanelDefinition } from "../types";

const currentStep = ref(0);
const sequentialContainer = ref();

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
});

const formErrors = ref<Record<string, string>>({});

const formPanels: FormPanelDefinition[] = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Tell us about yourself",
  },
  {
    id: "address",
    title: "Address Information",
    description: "Where should we send your order?",
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Confirm your information",
  },
];

// Local navigation instance for debug state access
const localNavigation = useNavigation(formPanels, currentStep.value);

// Keep local navigation in sync with main navigation
watch(currentStep, (newValue) => {
  if (newValue !== localNavigation.currentPanel.value) {
    localNavigation.goTo(newValue);
  }
});

function validatePersonalInfo() {
  const errors: Record<string, string> = {};

  if (!formData.value.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.value.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!formData.value.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
}

function validateAddressInfo() {
  const errors: Record<string, string> = {};

  if (!formData.value.address.trim()) {
    errors.address = "Address is required";
  }

  if (!formData.value.city.trim()) {
    errors.city = "City is required";
  }

  if (!formData.value.state.trim()) {
    errors.state = "State is required";
  }

  if (!formData.value.zipCode.trim()) {
    errors.zipCode = "ZIP code is required";
  }

  if (!formData.value.country.trim()) {
    errors.country = "Country is required";
  }

  return errors;
}

function handleNext(nextFn: () => Promise<boolean>) {
  // Clear previous errors
  formErrors.value = {};

  // Validate current step
  let errors: Record<string, string> = {};

  if (currentStep.value === 0) {
    errors = validatePersonalInfo();
  } else if (currentStep.value === 1) {
    errors = validateAddressInfo();
  }

  formErrors.value = errors;

  // If no errors, proceed to next step
  if (Object.keys(errors).length === 0) {
    nextFn();
  }
}

function submitForm() {
  alert(
    "Form submitted successfully! 🎉\n\nThis is just a demo - no data was actually sent.",
  );
}

function getCountryName(code: string) {
  const countries: Record<string, string> = {
    US: "United States",
    CA: "Canada",
    UK: "United Kingdom",
    AU: "Australia",
  };
  return countries[code] || code;
}
</script>
