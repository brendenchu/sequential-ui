import type {
  SequentialConfig,
  SequentialPanelDefinition,
  SequentialNavigationEvent,
} from '../types'
import { NavigationManager } from '../utils/navigation'

/**
 * Main sequential manager - framework agnostic
 * Simple wrapper around NavigationManager with configuration management
 */
export class SequentialManager {
  private navigationManager: NavigationManager
  private _config: SequentialConfig

  constructor(config: SequentialConfig) {
    this._config = { ...config }

    this.navigationManager = new NavigationManager(
      config.panels, 
      config.currentPanel || 0, 
      {
        loop: config.loop,
        onBeforeNavigate: this.handleBeforeNavigate.bind(this),
        onAfterNavigate: this.handleAfterNavigate.bind(this),
      }
    )
  }

  // Delegate navigation methods
  get currentPanel(): number {
    return this.navigationManager.currentPanel
  }

  get totalPanels(): number {
    return this.navigationManager.totalPanels
  }

  get canGoNext(): boolean {
    return this.navigationManager.canGoNext
  }

  get canGoPrevious(): boolean {
    return this.navigationManager.canGoPrevious
  }

  get isFirst(): boolean {
    return this.navigationManager.isFirst
  }

  get isLast(): boolean {
    return this.navigationManager.isLast
  }

  get progress(): number {
    return this.navigationManager.progress
  }

  get isNavigating(): boolean {
    return this.navigationManager.isNavigating
  }

  async next(): Promise<boolean> {
    return this.navigationManager.next()
  }

  async previous(): Promise<boolean> {
    return this.navigationManager.previous()
  }

  async goTo(index: number): Promise<boolean> {
    return this.navigationManager.goTo(index)
  }

  // Configuration management
  updateConfig(config: Partial<SequentialConfig>) {
    this._config = { ...this._config, ...config }

    if (config.panels) {
      this.navigationManager.updatePanels(config.panels)
    }
  }

  getConfig(): SequentialConfig {
    return { ...this._config }
  }

  // Panel management
  getCurrentPanel(): SequentialPanelDefinition | null {
    return this.navigationManager.getCurrentPanel()
  }

  getPanel(index: number): SequentialPanelDefinition | null {
    return this.navigationManager.getPanel(index)
  }

  // Event handlers (can be extended in future sessions)
  private async handleBeforeNavigate(_event: SequentialNavigationEvent): Promise<boolean> {
    // Future sessions will add validation logic here
    return true
  }

  private handleAfterNavigate(_event: SequentialNavigationEvent) {
    // Future sessions will add post-navigation logic here
  }

  // Cleanup placeholder
  destroy() {
    // Future sessions will add cleanup logic here
  }
}