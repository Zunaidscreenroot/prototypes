# Prototype Lab

A lightweight Next.js environment for building functional prototypes, testing interactions, and creating client-ready demos.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding prototypes

Create a new route under `app/`, for example:

```
app/
  prototype-name/
    page.tsx
```

Keep prototypes isolated so each flow can be tested and demonstrated independently.

## Deployment

This repository is intended to be connected to Vercel. Each push to the main branch can be used as the production deployment, while branches can be used for client-specific or experimental previews.
