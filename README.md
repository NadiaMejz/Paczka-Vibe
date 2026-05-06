# Accessibility First Finder

## Author

- **Name:** Nadia Mejza
- **Email:** nadia.mejza@gmail.com

## Overview

Accessibility First Finder is a React web application that helps users plan an InPost Paczkomat pickup around their current mood and nearby places. It combines InPost locker search, TomTom map data, routing, and place discovery to turn a simple parcel pickup into a more useful route plan.

The problem I chose to solve is intentionally small but practical: parcel pickup is usually treated as a single errand, but in real life people often combine it with coffee, studying, groceries, or a walk. The app narrows that vague daily-planning idea into one clear workflow: choose the kind of pickup you want, enter a locker, and get a map-based plan.

## Demo & Description

The app lets users search for an InPost Paczkomat by locker name, such as `WAW163M`, or by street and city, such as `Puławska, Warszawa`. Locker-name search is normalized to uppercase before submitting, so users do not need to match the exact casing.

Users choose one of several pickup moods:

- **Coffee break**: finds coffee shops near the selected locker.
- **Quick pickup**: creates a direct route from the user's current location to the locker.
- **Study mode**: looks for cafes, libraries, and coworking-style study spots nearby.
- **Open late**: searches for late-night grocery or convenience options near the locker.
- **Walk**: creates a walking route with a small detour and nearby coffee options.

The solution uses a modular React structure. UI is split into reusable components, API calls are isolated in service modules, shared formatting and map-link logic lives in utility modules, and TomTom map lifecycle behavior is handled through a dedicated hook. This keeps `App.jsx` focused on application orchestration instead of low-level implementation details.

The map is powered by TomTom Web SDK. InPost locker data is fetched from the public InPost points API, while nearby places and routes are fetched from TomTom APIs. The UI also includes a tiled background texture and subtle scroll and pointer-based motion effects, with support for reduced-motion user preferences.

The main technical choice was to keep the architecture simple, but still professional enough to grow. Instead of keeping all behavior in one large component, the project separates:

- **components** for reusable UI pieces
- **services** for InPost, TomTom, geolocation, and HTTP requests
- **hooks** for TomTom map lifecycle and motion behavior
- **utils** for formatting, map links, locker addresses, place filtering, and route helpers
- **constants** for mood definitions
- **config** for environment variables

This structure makes the code easier to read and gives each file one clear reason to change. It also makes error handling and future tests easier to add because API logic and UI rendering are not mixed together.

The app handles several practical edge cases:

- missing locker input
- locker-name casing differences
- no operating locker found
- missing TomTom API key
- browser geolocation errors
- no nearby places found for a selected mood
- no route returned by the routing API
- reduced-motion browser preference

For creativity, I treated the task as more than a basic map search. The mood-based flow turns a functional errand into a small planning assistant, and the UI uses a custom tiled texture and live motion effects to make the experience feel more personal.


## Technologies

- **React**: used for building the interactive UI.
- **Vite**: used for local development, bundling, and fast refresh.
- **TomTom Web SDK Maps**: used to render the interactive map.
- **TomTom Search and Routing APIs**: used for nearby places and route calculations.
- **InPost Points API**: used to find operating Paczkomat lockers in Poland.
- **CSS**: used for the responsive layout, visual design, tiled background, and motion effects.
- **ESLint**: used for code quality checks.

I chose React and Vite because they are lightweight enough for this scope and make it fast to build a focused single-page application. I used the official TomTom Web SDK for the map instead of hand-rolling map behavior, because map rendering, markers, bounds, and route display are specialized concerns that are better handled by a proven library.

## How to run

### Prerequisites

You need:

- Node.js
- npm
- A TomTom API key

### Build & run

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd accessibility-first-finder
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your TomTom API key to `.env.local`:

```bash
VITE_TOMTOM_API_KEY=your_tomtom_api_key_here
```

Start the development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

The project does not currently include automated unit tests. The available automated verification is:

```bash
npm run lint
npm run build
```

These checks confirm that the code is lint-clean and that the production bundle builds successfully from a clean setup.

## What I would do with more time

First, I would improve result ranking so that nearby places are scored not only by distance, but also by opening hours, category quality, and usefulness for the selected mood. This would make the generated plans feel more intentional.

Next, I would add more robust loading and empty states for individual API failures. For example, if route calculation fails but locker search succeeds, the app could still show the locker and nearby places instead of failing the whole plan.

I would also add automated tests around the API service layer and utility functions, especially locker-name normalization, map-link generation, open-late filtering, study-place filtering, and route waypoint generation. I would prioritize these because they protect the most important business logic without requiring a heavy end-to-end setup.

Finally, I would prepare the app for deployment by adding environment-specific configuration, API-key domain restrictions, and a short hosted demo. After that, I would consider adding saved favorite lockers or shareable pickup plans.

## AI usage

I used AI assistance while refactoring and polishing the project. AI helped with splitting the original single-file `App.jsx` into a modular structure, creating reusable components, organizing API services and utility functions, improving the README, and adding CSS-based UI motion.

I also used AI to look for possible bugs, review edge cases, and sometimes draft individual functions.

I verified the output by reviewing the generated code, keeping the app's existing behavior intact, and running:

```bash
npm run lint
npm run build
```

AI suggestions were adapted to match the project's actual structure and kept intentionally simple so the app remains maintainable.

## Anything else?

The TomTom API key is loaded through `VITE_TOMTOM_API_KEY` in `.env.local`. This file is ignored by Git. Because Vite exposes `VITE_*` variables to the browser, the key should be restricted in the TomTom dashboard by allowed domains or origins before deployment.

One important design decision is that this is a frontend-only prototype. That keeps the project easy to run locally, but it also means API keys cannot be treated as true secrets in production. A production version could introduce a small backend proxy if stricter API-key protection or request shaping became necessary.
