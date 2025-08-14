# Changelog

All notable changes to Sequential UI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-08-14

### Added
- Framework-agnostic SequentialManager and NavigationManager classes
- Complete TypeScript type definitions and interfaces
- Panel management with validation hooks (canNavigateFrom/canNavigateTo)
- Navigation state tracking (currentPanel, progress, canGoNext/canGoPrevious)
- Event-driven architecture with onBeforeNavigate/onAfterNavigate hooks
- Loop navigation support
- ESM module exports with proper .js extensions
- Disabled panel support
- SequentialContainer.vue component with flexible slot system
- useNavigation composable with reactive state management
- v-model:currentPanel two-way binding support
- Built-in navigation controls, progress bars, and indicators
- Tailwind CSS styling with customizable classes
- Interactive playground with 4 example implementations
- Auto-play carousel functionality
- Form validation patterns with async support
- Real-time debug state containers
- Vitest testing suite with 51 unit tests
- Complete API documentation in docs/api/
- Getting started guide with Vue examples
- ESLint and Prettier configuration
- pnpm monorepo structure with workspace dependencies

### Fixed
- Vue reactivity issues in debug state containers
- Template compilation warnings in Vite
- TypeScript type safety across playground examples
- Icon component performance with markRaw optimization