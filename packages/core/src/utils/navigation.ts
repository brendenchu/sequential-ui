import type {
  SequentialPanelDefinition,
  SequentialNavigationEvent,
  SequentialNavigationManager,
  SequentialManagerOptions,
  SequentialDirection,
} from '../types'

/**
 * Framework-agnostic navigation manager
 * Handles sequential panel navigation with basic state management
 */
export class NavigationManager implements SequentialNavigationManager {
  private _currentPanel: number
  private _panels: SequentialPanelDefinition[]
  private _isNavigating = false
  private _options: SequentialManagerOptions

  constructor(
    panels: SequentialPanelDefinition[],
    initialPanel = 0,
    options: SequentialManagerOptions = {}
  ) {
    this._panels = panels
    this._currentPanel = Math.max(0, Math.min(initialPanel, panels.length - 1))
    this._options = { loop: false, ...options }
  }

  // Getters for computed properties
  get currentPanel(): number {
    return this._currentPanel
  }

  get totalPanels(): number {
    return this._panels.length
  }

  get isFirst(): boolean {
    return this._currentPanel === 0
  }

  get isLast(): boolean {
    return this._currentPanel === this.totalPanels - 1
  }

  get canGoPrevious(): boolean {
    if (this._isNavigating) return false
    return this._options.loop ? this.totalPanels > 1 : !this.isFirst
  }

  get canGoNext(): boolean {
    if (this._isNavigating) return false
    return this._options.loop ? this.totalPanels > 1 : !this.isLast
  }

  get progress(): number {
    if (this.totalPanels === 0) {
      return 0
    }
    return ((this._currentPanel + 1) / this.totalPanels) * 100
  }

  get isNavigating(): boolean {
    return this._isNavigating
  }

  /**
   * Update panels array
   */
  updatePanels(panels: SequentialPanelDefinition[]) {
    this._panels = panels
    if (this._currentPanel >= panels.length) {
      this._currentPanel = Math.max(0, panels.length - 1)
    }
  }

  /**
   * Basic navigation validation
   */
  private async validateNavigation(from: number, to: number): Promise<boolean> {
    const fromPanel = this._panels[from]
    const toPanel = this._panels[to]

    if (!fromPanel || !toPanel) return false

    // Check if target panel is disabled
    if (toPanel.disabled) return false

    // Check basic navigation constraints
    if (fromPanel.canNavigateFrom) {
      const canLeave = await fromPanel.canNavigateFrom()
      if (!canLeave) return false
    }

    if (toPanel.canNavigateTo) {
      const canEnter = await toPanel.canNavigateTo()
      if (!canEnter) return false
    }

    return true
  }

  /**
   * Navigate to specific panel index
   */
  async goTo(index: number): Promise<boolean> {
    if (this._isNavigating) return false

    const targetIndex = Math.max(0, Math.min(index, this.totalPanels - 1))
    if (targetIndex === this._currentPanel) return true

    const direction: SequentialDirection = targetIndex > this._currentPanel ? 'next' : 'previous'
    const event: SequentialNavigationEvent = {
      from: this._currentPanel,
      to: targetIndex,
      direction,
      panel: this._panels[targetIndex],
    }

    this._isNavigating = true

    try {
      // Run validation
      const canNavigate = await this.validateNavigation(this._currentPanel, targetIndex)
      if (!canNavigate) return false

      // Run before navigate hook
      if (this._options.onBeforeNavigate) {
        const shouldContinue = await this._options.onBeforeNavigate(event)
        if (!shouldContinue) return false
      }

      // Perform navigation
      this._currentPanel = targetIndex

      // Run after navigate hook
      if (this._options.onAfterNavigate) {
        this._options.onAfterNavigate(event)
      }

      return true
    } catch (error) {
      console.error('Navigation failed:', error)
      return false
    } finally {
      this._isNavigating = false
    }
  }

  /**
   * Navigate to next panel
   */
  async next(): Promise<boolean> {
    if (!this.canGoNext) return false

    let nextIndex = this._currentPanel + 1
    if (nextIndex >= this.totalPanels && this._options.loop) {
      nextIndex = 0
    }

    return this.goTo(nextIndex)
  }

  /**
   * Navigate to previous panel
   */
  async previous(): Promise<boolean> {
    if (!this.canGoPrevious) return false

    let prevIndex = this._currentPanel - 1
    if (prevIndex < 0 && this._options.loop) {
      prevIndex = this.totalPanels - 1
    }

    return this.goTo(prevIndex)
  }

  /**
   * Get current panel data
   */
  getCurrentPanel(): SequentialPanelDefinition | null {
    return this._panels[this._currentPanel] || null
  }

  /**
   * Get panel by index
   */
  getPanel(index: number): SequentialPanelDefinition | null {
    return this._panels[index] || null
  }
}
