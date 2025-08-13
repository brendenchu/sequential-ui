# Changelog

All notable changes to Sequential UI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Framework-agnostic SequentialManager and NavigationManager classes
- Complete TypeScript type definitions and interfaces
- Panel management with validation hooks (canNavigateFrom/canNavigateTo)
- Navigation state tracking (currentPanel, progress, canGoNext/Previous)
- Event-driven architecture with onBeforeNavigate/onAfterNavigate hooks
- Loop navigation support
- ESM module exports with proper .js extensions
- Comprehensive API documentation in docs/api/
- Basic panel validation and disabled panel support

### Developer Experience
- Full TypeScript compilation and type checking
- ESLint and Prettier configuration
- Development and build scripts via pnpm
- Monorepo structure with workspace configuration

## [0.1.0] - Coming Soon

**Note**: 0.1.0 will be released when Vue components are ready, providing the first usable version with UI components.