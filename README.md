# Accessibility First Finder

A React + Vite app for building InPost Paczkomat pickup plans with TomTom maps, nearby places, and route suggestions.

## Features

- Search for an InPost parcel locker by locker name or by `street, city`
- Choose a pickup mood such as coffee, quick pickup, study mode, open late, or walk
- Show the locker, nearby places, and routes on a TomTom map
- Generate a Google Maps link for the selected pickup plan

## Requirements

- Node.js
- npm
- TomTom API key

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your TomTom API key:

```bash
VITE_TOMTOM_API_KEY=your_tomtom_api_key_here
```

Run the app:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

`.env.local` is intentionally ignored by Git. Vite exposes `VITE_*` variables to the browser, so restrict your TomTom API key by allowed domains/origins in the TomTom dashboard.
