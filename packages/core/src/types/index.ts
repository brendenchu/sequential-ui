// Direction of sequential transition
export type SequentialDirection = 'next' | 'previous' | 'none'

// Individual panel definition - framework agnostic
export interface SequentialPanelDefinition<T = Record<string, unknown>> {
  id: string | number
  component?: unknown
  props?: T
  content?: () => unknown
  disabled?: boolean
  canNavigateFrom?: () => boolean | Promise<boolean>
  canNavigateTo?: () => boolean | Promise<boolean>
}

// Navigation event data
export interface SequentialNavigationEvent {
  from: number
  to: number
  direction: SequentialDirection
  panel: SequentialPanelDefinition
}

// Sequential navigation manager interface
export interface SequentialNavigationManager {
  readonly currentPanel: number
  readonly totalPanels: number
  readonly canGoNext: boolean
  readonly canGoPrevious: boolean
  readonly isFirst: boolean
  readonly isLast: boolean
  readonly progress: number
  next(): Promise<boolean>
  previous(): Promise<boolean>
  goTo(index: number): Promise<boolean>
}

// Sequential manager event handlers
export interface SequentialEventHandlers {
  onBeforeNavigate?: (event: SequentialNavigationEvent) => boolean | Promise<boolean>
  onAfterNavigate?: (event: SequentialNavigationEvent) => void
}

// Sequential manager options
export interface SequentialManagerOptions extends SequentialEventHandlers {
  loop?: boolean
}

// Main sequential container configuration
export interface SequentialConfig {
  panels: SequentialPanelDefinition[]
  currentPanel?: number
  loop?: boolean
}
