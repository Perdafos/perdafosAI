# React + TypeScript + Shadcn Starter Pack

A modern starter template for building React applications with TypeScript, Tailwind CSS, Shadcn UI, and Lucide Icons. Everything is pre-configured and ready to use for development and production environments.

## Key Features

- **Vite** - Ultra-fast build tool with Hot Module Replacement (HMR)
- **React 19** - Latest UI library with optimal performance
- **TypeScript** - Type safety for safer and more scalable code
- **Shadcn UI** - Premium accessible and customizable React components
- **Lucide Icons** - Modern icon library with 400+ ready-to-use icons
- **Tailwind CSS v4** - Utility-first CSS framework with best performance
- **ESLint** - Lint rules to maintain code quality
- **Path Alias** - Clean imports with `@/` alias

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** v18+ ([Download here](https://nodejs.org/))
- **npm** or **yarn** (usually comes automatically with Node.js)

Verify your versions:
```bash
node --version
npm --version
```

## Quick Start

### 1. Clone Repository (If from GitHub)
```bash
git clone <repository-url>
cd starter-react
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The server will run at `http://localhost:5173` and automatically reload when code changes.

### 4. Build for Production
```bash
npm run build
```

Output will be saved in the `dist/` folder ready for deployment.

### 5. Preview Local Build
```bash
npm run preview
```

## Project Structure

```
starter-react/
├── src/
│   ├── components/
│   │   └── ui/                 # Shadcn UI components
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── pages/
│   │   └── App.tsx             # Main page component
│   ├── lib/
│   │   └── utils.ts            # Utility functions (cn helper)
│   ├── assets/                 # Images, fonts, etc.
│   ├── App.css                 # Global styles (optional)
│   ├── index.css               # Tailwind directives
│   └── main.tsx                # Entry point
├── public/                     # Static assets
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind configuration
├── eslint.config.js            # ESLint configuration
├── components.json             # Shadcn CLI configuration
└── package.json                # Dependencies & scripts
```

## Tech Stack

| Technology | Version | Description |
|-----------|---------|-------------|
| React | 19.x | UI library |
| TypeScript | 5.9 | Type safety |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 4.x | CSS utility framework |
| Shadcn UI | Latest | Component library |
| Lucide Icons | 576.x | Icon library |
| Radix UI | 1.x | Headless UI components |

## NPM Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview local build |
| `npm run lint` | Run ESLint |

## Using Shadcn UI

### Add New Components

Use the Shadcn CLI to add components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
```

Components will be automatically installed and ready to use.

### Usage Example
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Brief description</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => alert('Clicked!')}>Click Me</Button>
      </CardContent>
    </Card>
  )
}
```

## Using Lucide Icons

All Lucide icons can be directly imported and used:

```tsx
import { Heart, Star, Zap, Settings, Menu, X } from 'lucide-react'

export function IconsDemo() {
  return (
    <div className="flex gap-4">
      <Heart className="w-6 h-6 text-red-500" />
      <Star className="w-6 h-6 text-yellow-500" />
      <Zap className="w-6 h-6 text-blue-500" />
      <Settings className="w-6 h-6" />
    </div>
  )
}
```

**Tips:**
- Use `className` with Tailwind for styling
- Default size is `24px` (w-6 h-6 in Tailwind)
- Browse all icons at [lucide.dev](https://lucide.dev)

## Customizing Tailwind

Edit `tailwind.config.js` to customize colors, fonts, etc.:

```js
export default {
  theme: {
    extend: {
      colors: {
        'brand': '#3B82F6',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
}
```

## Path Alias

Use the `@/` alias for cleaner imports:

```tsx
// Avoid
import { Button } from "../../../components/ui/button"

// Use instead
import { Button } from "@/components/ui/button"
```

Configuration is already available in `tsconfig.json` and `vite.config.ts`.

## Troubleshooting

### Error: "Cannot find module '@/components/ui/card'"
- Make sure the component file exists in the correct location
- Restart the dev server (`npm run dev`)
- Clear browser cache (Ctrl+Shift+Delete)

### Dev server does not auto-reload
- Kill dev server process: `Ctrl+C`
- Run again: `npm run dev`

### Build size is too large
- Check for unnecessary dependencies in `package.json`
- Use dynamic imports for code splitting:
  ```tsx
  const HeavyComponent = lazy(() => import('@/components/Heavy'))
  ```

## Resources & Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vite.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

## License

Free to use for personal and commercial projects.

---

Happy Coding!
