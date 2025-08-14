import { describe, it, expect, beforeEach } from 'vitest'
import { SequentialManager } from './SequentialManager.js'
import type { SequentialConfig, SequentialPanelDefinition } from '../types/index.js'

describe('SequentialManager', () => {
  let manager: SequentialManager
  let basicPanels: SequentialPanelDefinition[]

  beforeEach(() => {
    basicPanels = [{ id: 'panel-1' }, { id: 'panel-2' }, { id: 'panel-3' }]

    const config: SequentialConfig = {
      panels: basicPanels,
      currentPanel: 0,
      loop: false,
    }

    manager = new SequentialManager(config)
  })

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      expect(manager.currentPanel).toBe(0)
      expect(manager.totalPanels).toBe(3)
      expect(manager.isFirst).toBe(true)
      expect(manager.isLast).toBe(false)
      expect(manager.progress).toBe(33.33333333333333)
      expect(manager.isNavigating).toBe(false)
    })

    it('should initialize with custom starting panel', () => {
      const config: SequentialConfig = {
        panels: basicPanels,
        currentPanel: 1,
      }
      const customManager = new SequentialManager(config)

      expect(customManager.currentPanel).toBe(1)
      expect(customManager.isFirst).toBe(false)
      expect(customManager.isLast).toBe(false)
    })
  })

  describe('navigation state', () => {
    it('should correctly report navigation capabilities', () => {
      // First panel
      expect(manager.canGoNext).toBe(true)
      expect(manager.canGoPrevious).toBe(false)
      expect(manager.isFirst).toBe(true)
      expect(manager.isLast).toBe(false)
    })

    it('should update state after navigation', async () => {
      await manager.next()

      expect(manager.currentPanel).toBe(1)
      expect(manager.canGoNext).toBe(true)
      expect(manager.canGoPrevious).toBe(true)
      expect(manager.isFirst).toBe(false)
      expect(manager.isLast).toBe(false)
      expect(manager.progress).toBe(66.66666666666666)
    })

    it('should handle last panel state', async () => {
      await manager.goTo(2)

      expect(manager.currentPanel).toBe(2)
      expect(manager.canGoNext).toBe(false)
      expect(manager.canGoPrevious).toBe(true)
      expect(manager.isFirst).toBe(false)
      expect(manager.isLast).toBe(true)
      expect(manager.progress).toBe(100)
    })
  })

  describe('navigation methods', () => {
    it('should navigate forward successfully', async () => {
      const result = await manager.next()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(1)
    })

    it('should navigate backward successfully', async () => {
      await manager.next()
      const result = await manager.previous()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(0)
    })

    it('should navigate to specific panel', async () => {
      const result = await manager.goTo(2)
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(2)
    })

    it('should prevent navigation beyond bounds', async () => {
      // Try to go previous from first panel
      const prevResult = await manager.previous()
      expect(prevResult).toBe(false)
      expect(manager.currentPanel).toBe(0)

      // Go to last panel and try to go next
      await manager.goTo(2)
      const nextResult = await manager.next()
      expect(nextResult).toBe(false)
      expect(manager.currentPanel).toBe(2)
    })

    it('should handle invalid goTo indices', async () => {
      const negativeResult = await manager.goTo(-1)
      expect(negativeResult).toBe(true) // Should clamp to 0
      expect(manager.currentPanel).toBe(0)

      const tooHighResult = await manager.goTo(10)
      expect(tooHighResult).toBe(true) // Should clamp to last panel
      expect(manager.currentPanel).toBe(2)
    })
  })

  describe('loop navigation', () => {
    beforeEach(() => {
      const config: SequentialConfig = {
        panels: basicPanels,
        currentPanel: 0,
        loop: true,
      }
      manager = new SequentialManager(config)
    })

    it('should enable navigation capabilities with loop', () => {
      expect(manager.canGoNext).toBe(true)
      expect(manager.canGoPrevious).toBe(true)
    })

    it('should loop from last to first panel', async () => {
      await manager.goTo(2) // Go to last panel
      const result = await manager.next()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(0) // Should wrap to first
    })

    it('should loop from first to last panel', async () => {
      const result = await manager.previous()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(2) // Should wrap to last
    })
  })

  describe('panel management', () => {
    it('should get current panel data', () => {
      const panel = manager.getCurrentPanel()
      expect(panel).toEqual({ id: 'panel-1' })
    })

    it('should get panel by index', () => {
      const panel = manager.getPanel(1)
      expect(panel).toEqual({ id: 'panel-2' })
    })

    it('should return null for invalid panel index', () => {
      const panel = manager.getPanel(10)
      expect(panel).toBeNull()
    })
  })

  describe('configuration management', () => {
    it('should update configuration', () => {
      manager.updateConfig({ loop: true })
      const config = manager.getConfig()
      expect(config.loop).toBe(true)
    })

    it('should update panels and adjust current position', () => {
      const newPanels = [{ id: 'new-panel' }]
      manager.updateConfig({ panels: newPanels })

      expect(manager.totalPanels).toBe(1)
      expect(manager.currentPanel).toBe(0) // Should adjust to valid position
    })

    it('should return configuration copy', () => {
      const config1 = manager.getConfig()
      const config2 = manager.getConfig()
      expect(config1).toEqual(config2)
      expect(config1).not.toBe(config2) // Should be different objects
    })
  })

  describe('panel validation', () => {
    it('should respect disabled panels', async () => {
      const panelsWithDisabled: SequentialPanelDefinition[] = [
        { id: 'panel-1' },
        { id: 'panel-2', disabled: true },
        { id: 'panel-3' },
      ]

      const config: SequentialConfig = {
        panels: panelsWithDisabled,
        currentPanel: 0,
      }

      const testManager = new SequentialManager(config)

      // Try to navigate to disabled panel
      const result = await testManager.goTo(1)
      expect(result).toBe(false)
      expect(testManager.currentPanel).toBe(0)
    })

    it('should respect canNavigateFrom validation', async () => {
      const panelsWithValidation: SequentialPanelDefinition[] = [
        {
          id: 'panel-1',
          canNavigateFrom: () => false, // Block navigation
        },
        { id: 'panel-2' },
      ]

      const config: SequentialConfig = {
        panels: panelsWithValidation,
        currentPanel: 0,
      }

      const testManager = new SequentialManager(config)

      const result = await testManager.next()
      expect(result).toBe(false)
      expect(testManager.currentPanel).toBe(0)
    })

    it('should respect canNavigateTo validation', async () => {
      const panelsWithValidation: SequentialPanelDefinition[] = [
        { id: 'panel-1' },
        {
          id: 'panel-2',
          canNavigateTo: () => false, // Block navigation
        },
      ]

      const config: SequentialConfig = {
        panels: panelsWithValidation,
        currentPanel: 0,
      }

      const testManager = new SequentialManager(config)

      const result = await testManager.goTo(1)
      expect(result).toBe(false)
      expect(testManager.currentPanel).toBe(0)
    })
  })
})
