import type { SequentialPanelDefinition } from '@sequential-ui/core'

// Extended panel definitions for playground examples
export interface PlaygroundPanelDefinition extends SequentialPanelDefinition {
  title?: string
  description?: string
  emoji?: string
  icon?: unknown // Vue component object
}

export interface FormPanelDefinition extends SequentialPanelDefinition {
  title: string
  description: string
}

export interface CarouselPanelDefinition extends SequentialPanelDefinition {
  title: string
  description?: string
  emoji: string
}
