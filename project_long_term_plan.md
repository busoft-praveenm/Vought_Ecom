# Frontend Long-Term Architecture Plan

## 1. UI Framework
- **Framework**: We will strictly use **shadcn/ui** for all UI components.
- **Deprecation**: Material UI (MUI) is strictly deprecated and must not be used or installed in this project.

## 2. Component Folder Structure Standards
To ensure components remain modular and highly reusable across current and future projects, we adhere to a dedicated folder structure for each component.

- **Structure Strategy**: Instead of placing multiple components in a single `components/ui/` directory, every UI component must be wrapped or relocated into its own dedicated folder.
- **Example Pattern**:
  - `src/components/button/index.tsx` (or `Button.tsx`)
  - `src/components/input/index.tsx`
  - `src/components/card/index.tsx`
  - `src/components/toaster/index.tsx`
- **Generators**: When using the shadcn/ui CLI to add a component (e.g., `npx shadcn@latest add button`), the generated file (typically placed in `components/ui/button.tsx`) MUST be moved and refactored into the corresponding directory (e.g., `src/components/button/`). Any dependencies or paths must be updated accordingly.

## 3. Layouts
- Reusable layouts should also follow the component structure, for example: `src/components/layout/topbar/`.

This ensures an easily scalable and strictly standardized component library.
