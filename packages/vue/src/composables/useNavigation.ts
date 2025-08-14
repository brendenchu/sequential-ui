import { ref, onUnmounted, type Ref } from 'vue'
import { SequentialManager } from '@sequential-ui/core'
import type {
  SequentialConfig,
  SequentialPanelDefinition,
  SequentialNavigationEvent,
} from '@sequential-ui/core'

export interface UseNavigationOptions {
  loop?: boolean
  onBeforeNavigate?: (event: SequentialNavigationEvent) => boolean | Promise<boolean>
  onAfterNavigate?: (event: SequentialNavigationEvent) => void
}

export interface UseNavigationReturn {
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

  // Manager access for advanced use cases
  manager: SequentialManager
}

/**
 * Vue composable for sequential navigation
 *
 * Wraps the core SequentialManager with Vue reactivity and lifecycle management
 */
export function useNavigation(
  panels: Ref<SequentialPanelDefinition[]> | SequentialPanelDefinition[],
  initialPanel: number = 0,
  options: UseNavigationOptions = {}
): UseNavigationReturn {
  // Get initial panels value
  const initialPanels = Array.isArray(panels) ? panels : panels.value

  // Create the sequential manager
  const config: SequentialConfig = {
    panels: initialPanels,
    currentPanel: initialPanel,
    loop: options.loop || false,
  }

  const manager = new SequentialManager(config)

  // Override event handlers to trigger reactivity updates
  const originalBeforeNavigate = manager['handleBeforeNavigate'].bind(manager)
  const originalAfterNavigate = manager['handleAfterNavigate'].bind(manager)

  manager['handleBeforeNavigate'] = async (event: SequentialNavigationEvent): Promise<boolean> => {
    const result = await originalBeforeNavigate(event)
    if (!result) return false

    if (options.onBeforeNavigate) {
      return await options.onBeforeNavigate(event)
    }

    return true
  }

  manager['handleAfterNavigate'] = (event: SequentialNavigationEvent): void => {
    originalAfterNavigate(event)

    // Trigger reactivity updates
    updateReactiveState()

    if (options.onAfterNavigate) {
      options.onAfterNavigate(event)
    }
  }

  // Reactive state
  const currentPanel = ref(manager.currentPanel)
  const totalPanels = ref(manager.totalPanels)
  const canGoNext = ref(manager.canGoNext)
  const canGoPrevious = ref(manager.canGoPrevious)
  const isFirst = ref(manager.isFirst)
  const isLast = ref(manager.isLast)
  const progress = ref(manager.progress)
  const isNavigating = ref(manager.isNavigating)

  // Function to update all reactive state
  function updateReactiveState() {
    currentPanel.value = manager.currentPanel
    totalPanels.value = manager.totalPanels
    canGoNext.value = manager.canGoNext
    canGoPrevious.value = manager.canGoPrevious
    isFirst.value = manager.isFirst
    isLast.value = manager.isLast
    progress.value = manager.progress
    isNavigating.value = manager.isNavigating
  }

  // Navigation methods that update reactive state
  const next = async (): Promise<boolean> => {
    const result = await manager.next()
    updateReactiveState()
    return result
  }

  const previous = async (): Promise<boolean> => {
    const result = await manager.previous()
    updateReactiveState()
    return result
  }

  const goTo = async (index: number): Promise<boolean> => {
    const result = await manager.goTo(index)
    updateReactiveState()
    return result
  }

  // Panel management
  const updatePanels = (newPanels: SequentialPanelDefinition[]) => {
    manager.updateConfig({ panels: newPanels })
    updateReactiveState()
  }

  // Watch for changes to panels prop if it's a ref
  if (!Array.isArray(panels)) {
    // TODO: Add watch when panels ref changes
    // This would require importing { watch } from 'vue'
    // For now, users can call updatePanels manually
  }

  // Cleanup on unmount
  onUnmounted(() => {
    manager.destroy()
  })

  return {
    // Reactive state
    currentPanel,
    totalPanels,
    canGoNext,
    canGoPrevious,
    isFirst,
    isLast,
    progress,
    isNavigating,

    // Methods
    next,
    previous,
    goTo,
    getCurrentPanel: () => manager.getCurrentPanel(),
    getPanel: (index: number) => manager.getPanel(index),
    updatePanels,

    // Manager access
    manager,
  }
}
