import { ref, onUnmounted, watch, type Ref } from 'vue'
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
  currentPanelData: Ref<SequentialPanelDefinition | null>
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
  const currentPanelData = ref(manager.getCurrentPanel())
  const totalPanels = ref(manager.totalPanels)
  const canGoNext = ref(manager.canGoNext)
  const canGoPrevious = ref(manager.canGoPrevious)
  const isFirst = ref(manager.isFirst)
  const isLast = ref(manager.isLast)
  const progress = ref(manager.progress)
  const isNavigating = ref(manager.isNavigating)

  // Function to update all reactive state
  function updateReactiveState() {
    const oldPanel = currentPanel.value
    const oldPanelData = currentPanelData.value
    
    currentPanel.value = manager.currentPanel
    currentPanelData.value = manager.getCurrentPanel()
    totalPanels.value = manager.totalPanels
    canGoNext.value = manager.canGoNext
    canGoPrevious.value = manager.canGoPrevious
    isFirst.value = manager.isFirst
    isLast.value = manager.isLast
    progress.value = manager.progress
    console.log('[updateReactiveState] progress updated to:', progress.value)
    isNavigating.value = manager.isNavigating
    
    console.log('[updateReactiveState] panel changed from', oldPanel, 'to', currentPanel.value)
    console.log('[updateReactiveState] panelData changed from', oldPanelData?.id, 'to', currentPanelData.value?.id)
  }

  // Navigation methods that update reactive state
  const next = async (): Promise<boolean> => {
    console.log('[useNavigation] next() called, current panel:', currentPanel.value)
    const result = await manager.next()
    console.log('[useNavigation] manager.next() result:', result, 'new panel:', manager.currentPanel)
    updateReactiveState()
    console.log('[useNavigation] after updateReactiveState, currentPanelData:', currentPanelData.value)
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
    watch(
      panels,
      (newPanels) => {
        updatePanels(newPanels)
      },
      { deep: true }
    )
  }

  // Cleanup on unmount
  onUnmounted(() => {
    manager.destroy()
  })

  return {
    // Reactive state
    currentPanel,
    currentPanelData,
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
