import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NavigationManager } from './navigation.js'
import type { SequentialPanelDefinition, SequentialManagerOptions } from '../types/index.js'

describe('NavigationManager', () => {
  let manager: NavigationManager
  let basicPanels: SequentialPanelDefinition[]

  beforeEach(() => {
    basicPanels = [{ id: 'panel-1' }, { id: 'panel-2' }, { id: 'panel-3' }]

    manager = new NavigationManager(basicPanels, 0, { loop: false })
  })

  describe('initialization', () => {
    it('should initialize with correct state', () => {
      expect(manager.currentPanel).toBe(0)
      expect(manager.totalPanels).toBe(3)
      expect(manager.isFirst).toBe(true)
      expect(manager.isLast).toBe(false)
      expect(manager.isNavigating).toBe(false)
    })

    it('should clamp initial panel to valid range', () => {
      const manager1 = new NavigationManager(basicPanels, -1)
      expect(manager1.currentPanel).toBe(0)

      const manager2 = new NavigationManager(basicPanels, 10)
      expect(manager2.currentPanel).toBe(2) // Last valid index
    })

    it('should handle empty panels array', () => {
      const emptyManager = new NavigationManager([])
      expect(emptyManager.totalPanels).toBe(0)
      expect(emptyManager.currentPanel).toBe(0)
      expect(emptyManager.progress).toBe(0)
    })
  })

  describe('computed properties', () => {
    it('should calculate progress correctly', async () => {
      expect(manager.progress).toBe(33.33333333333333) // (0+1)/3 * 100

      await manager.goTo(1)
      expect(manager.progress).toBe(66.66666666666666) // (1+1)/3 * 100

      await manager.goTo(2)
      expect(manager.progress).toBe(100) // (2+1)/3 * 100
    })

    it('should report navigation capabilities correctly', async () => {
      // At first panel
      expect(manager.canGoNext).toBe(true)
      expect(manager.canGoPrevious).toBe(false)

      // Move to middle
      await manager.goTo(1)
      expect(manager.canGoNext).toBe(true)
      expect(manager.canGoPrevious).toBe(true)

      // Move to last
      await manager.goTo(2)
      expect(manager.canGoNext).toBe(false)
      expect(manager.canGoPrevious).toBe(true)
    })

    it('should handle loop navigation capabilities', () => {
      const loopManager = new NavigationManager(basicPanels, 0, { loop: true })

      // With loop enabled, should always be able to navigate (when >1 panel)
      expect(loopManager.canGoNext).toBe(true)
      expect(loopManager.canGoPrevious).toBe(true)

      // Single panel with loop
      const singlePanelManager = new NavigationManager([{ id: 'only' }], 0, {
        loop: true,
      })
      expect(singlePanelManager.canGoNext).toBe(false)
      expect(singlePanelManager.canGoPrevious).toBe(false)
    })
  })

  describe('panel management', () => {
    it('should get current panel', () => {
      const panel = manager.getCurrentPanel()
      expect(panel).toEqual({ id: 'panel-1' })
    })

    it('should get panel by index', () => {
      expect(manager.getPanel(0)).toEqual({ id: 'panel-1' })
      expect(manager.getPanel(1)).toEqual({ id: 'panel-2' })
      expect(manager.getPanel(2)).toEqual({ id: 'panel-3' })
    })

    it('should return null for invalid indices', () => {
      expect(manager.getPanel(-1)).toBeNull()
      expect(manager.getPanel(5)).toBeNull()
    })

    it('should update panels and adjust current position', () => {
      manager.goTo(2) // Move to last panel

      const newPanels = [{ id: 'new-1' }] // Only one panel
      manager.updatePanels(newPanels)

      expect(manager.totalPanels).toBe(1)
      expect(manager.currentPanel).toBe(0) // Should adjust to valid position
    })
  })

  describe('navigation methods', () => {
    it('should navigate to specific panel', async () => {
      const result = await manager.goTo(1)
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(1)
    })

    it('should clamp goTo index to valid range', async () => {
      await manager.goTo(-5)
      expect(manager.currentPanel).toBe(0)

      await manager.goTo(10)
      expect(manager.currentPanel).toBe(2)
    })

    it('should handle navigation to same panel', async () => {
      const result = await manager.goTo(0)
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(0)
    })

    it('should navigate next', async () => {
      const result = await manager.next()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(1)
    })

    it('should navigate previous', async () => {
      await manager.goTo(1)
      const result = await manager.previous()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(0)
    })

    it('should prevent navigation beyond bounds', async () => {
      // Try next from last panel
      await manager.goTo(2)
      const nextResult = await manager.next()
      expect(nextResult).toBe(false)
      expect(manager.currentPanel).toBe(2)

      // Try previous from first panel
      await manager.goTo(0)
      const prevResult = await manager.previous()
      expect(prevResult).toBe(false)
      expect(manager.currentPanel).toBe(0)
    })

    it('should prevent concurrent navigation', async () => {
      // Mock isNavigating to test concurrent navigation prevention
      const mockManager = new NavigationManager(basicPanels)

      // Start navigation (this will set isNavigating to true internally)
      const promise1 = mockManager.goTo(1)

      // Try to navigate while first navigation is in progress
      const result2 = await mockManager.goTo(2)
      expect(result2).toBe(false) // Should be blocked

      // Wait for first navigation to complete
      const result1 = await promise1
      expect(result1).toBe(true)
    })
  })

  describe('loop navigation', () => {
    beforeEach(() => {
      manager = new NavigationManager(basicPanels, 0, { loop: true })
    })

    it('should loop from last to first on next', async () => {
      await manager.goTo(2) // Go to last
      const result = await manager.next()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(0)
    })

    it('should loop from first to last on previous', async () => {
      const result = await manager.previous()
      expect(result).toBe(true)
      expect(manager.currentPanel).toBe(2)
    })
  })

  describe('validation', () => {
    it('should respect disabled panels', async () => {
      const panelsWithDisabled: SequentialPanelDefinition[] = [
        { id: 'panel-1' },
        { id: 'panel-2', disabled: true },
        { id: 'panel-3' },
      ]

      const disabledManager = new NavigationManager(panelsWithDisabled)
      const result = await disabledManager.goTo(1)

      expect(result).toBe(false)
      expect(disabledManager.currentPanel).toBe(0)
    })

    it('should call canNavigateFrom validation', async () => {
      const canNavigateFromSpy = vi.fn().mockReturnValue(false)
      const panelsWithValidation: SequentialPanelDefinition[] = [
        { id: 'panel-1', canNavigateFrom: canNavigateFromSpy },
        { id: 'panel-2' },
      ]

      const validationManager = new NavigationManager(panelsWithValidation)
      const result = await validationManager.goTo(1)

      expect(canNavigateFromSpy).toHaveBeenCalled()
      expect(result).toBe(false)
      expect(validationManager.currentPanel).toBe(0)
    })

    it('should call canNavigateTo validation', async () => {
      const canNavigateToSpy = vi.fn().mockReturnValue(false)
      const panelsWithValidation: SequentialPanelDefinition[] = [
        { id: 'panel-1' },
        { id: 'panel-2', canNavigateTo: canNavigateToSpy },
      ]

      const validationManager = new NavigationManager(panelsWithValidation)
      const result = await validationManager.goTo(1)

      expect(canNavigateToSpy).toHaveBeenCalled()
      expect(result).toBe(false)
      expect(validationManager.currentPanel).toBe(0)
    })

    it('should handle async validation', async () => {
      const asyncValidation = vi.fn().mockResolvedValue(true)
      const panelsWithAsync: SequentialPanelDefinition[] = [
        { id: 'panel-1', canNavigateFrom: asyncValidation },
        { id: 'panel-2' },
      ]

      const asyncManager = new NavigationManager(panelsWithAsync)
      const result = await asyncManager.goTo(1)

      expect(asyncValidation).toHaveBeenCalled()
      expect(result).toBe(true)
      expect(asyncManager.currentPanel).toBe(1)
    })
  })

  describe('event hooks', () => {
    it('should call onBeforeNavigate hook', async () => {
      const beforeHook = vi.fn().mockReturnValue(true)
      const options: SequentialManagerOptions = {
        onBeforeNavigate: beforeHook,
      }

      const hookManager = new NavigationManager(basicPanels, 0, options)
      await hookManager.goTo(1)

      expect(beforeHook).toHaveBeenCalledWith({
        from: 0,
        to: 1,
        direction: 'next',
        panel: basicPanels[1],
      })
    })

    it('should call onAfterNavigate hook', async () => {
      const afterHook = vi.fn()
      const options: SequentialManagerOptions = {
        onAfterNavigate: afterHook,
      }

      const hookManager = new NavigationManager(basicPanels, 0, options)
      await hookManager.goTo(1)

      expect(afterHook).toHaveBeenCalledWith({
        from: 0,
        to: 1,
        direction: 'next',
        panel: basicPanels[1],
      })
    })

    it('should block navigation when onBeforeNavigate returns false', async () => {
      const beforeHook = vi.fn().mockReturnValue(false)
      const afterHook = vi.fn()
      const options: SequentialManagerOptions = {
        onBeforeNavigate: beforeHook,
        onAfterNavigate: afterHook,
      }

      const hookManager = new NavigationManager(basicPanels, 0, options)
      const result = await hookManager.goTo(1)

      expect(result).toBe(false)
      expect(hookManager.currentPanel).toBe(0)
      expect(beforeHook).toHaveBeenCalled()
      expect(afterHook).not.toHaveBeenCalled()
    })

    it('should handle async hooks', async () => {
      const asyncBeforeHook = vi.fn().mockResolvedValue(true)
      const options: SequentialManagerOptions = {
        onBeforeNavigate: asyncBeforeHook,
      }

      const asyncHookManager = new NavigationManager(basicPanels, 0, options)
      const result = await asyncHookManager.goTo(1)

      expect(result).toBe(true)
      expect(asyncBeforeHook).toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should handle validation errors gracefully', async () => {
      const throwingValidation = vi.fn().mockRejectedValue(new Error('Validation failed'))
      const panelsWithError: SequentialPanelDefinition[] = [
        { id: 'panel-1', canNavigateFrom: throwingValidation },
        { id: 'panel-2' },
      ]

      const errorManager = new NavigationManager(panelsWithError)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await errorManager.goTo(1)

      expect(result).toBe(false)
      expect(errorManager.currentPanel).toBe(0)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle hook errors gracefully', async () => {
      const throwingHook = vi.fn().mockRejectedValue(new Error('Hook failed'))
      const options: SequentialManagerOptions = {
        onBeforeNavigate: throwingHook,
      }

      const errorHookManager = new NavigationManager(basicPanels, 0, options)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await errorHookManager.goTo(1)

      expect(result).toBe(false)
      expect(errorHookManager.currentPanel).toBe(0)
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})
