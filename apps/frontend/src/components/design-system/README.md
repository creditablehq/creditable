# Creditable Design System

A lightweight component library built for the Creditable web app, designed to match brand styling and support dynamic theming. This design system is built with modern React and Tailwind CSS, and is intended to be extended as the product grows.

## 📦 Getting Started

Clone the repo and install dependencies:

`pnpm install`

## 🧱 Components

The following components are currently included:

- **Button** — Supports variants like `default` and `outline`
- **Input** — Text input with validation and disabled states
- **Label** — Semantic labels for form fields
- **FormField** — Wrapper for form fields with label, help text, and validation states
- **Select** — (Deprecated in favor of Combobox)
- **Combobox** — Accessible keyboard-friendly select component
- **Modal** — Reusable modal component with backdrop
- **Card** — Simple container component
- **List/Table** — (Coming soon)

## 🧪 Usage

Make sure to import styles and components as needed. Example usage of a button:

`import { Button } from './components/design-system/Button';`

```tsx
function Example() {
  return <Button variant='outline'>Click Me</Button>;
}
```

## 🎨 Theming

This library supports dynamic theming via Tailwind's `brand` color palette. To adjust themes:

1. Update your `tailwind.config.js` to include `brand`, `brand-light`, `brand-dark`, etc.
2. Use a theme picker or context to toggle classes if needed.

## 🧼 Development Tips

- Use `pnpm dev` to run the design system in dev mode (if scaffolded separately)
- Organize components under a `design-system` or `components` folder
- Export all public components from an `index.ts` file for easy importing

## 🗂️ Directory Structure

```
components/
├── design-system/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Label.tsx
│   ├── FormField.tsx
│   ├── Combobox.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── index.ts
```

## 🔧 Planned Improvements

- Extend support for more form elements (Textarea, Radio, Checkbox)
- Add List/Table display components
- Add dark mode toggling
- Integrate Storybook or live documentation (future state)

## 📄 License

This library is currently internal and unlicensed. A proper license will be chosen later based on the project's open-source status.
