# Anima — Core Web Application

Anima is a premium, high-performance web application designed for anime discovery, manga exploration, and interactive media tracking. The application features a responsive glassmorphic UI, smooth micro-animations, and a highly optimized caching and prefetching architecture to deliver instant page transitions.

---

## Key Features

*   **Unified Media Discovery**: Multi-dimensional search and exploration sections for anime and manga listing datasets.
*   **Explore Hub**: Aggregated segments displaying trending media, seasonal favorites, upcoming releases, all-time popular titles, and the top 100 charts.
*   **Dynamic Media Detail Pages (`/anime/[id]` & `/manga/[id]`)**:
    *   **Overview**: Media descriptions, tags, relational links, and recommendations.
    *   **Cast & Characters**: Interactive character listings with role mappings.
    *   **Production Staff**: Comprehensive lists of directors, animators, and writers.
    *   **Media Analytics**: Beautiful, responsive SVG charts illustrating score distributions, user status spreads, and daily activity logs.
*   **Visual Carousels**: Slick, touch-responsive carousels highlighting featured content.
*   **Franchise Relations Mapping**: Interactive visual hierarchy linking sequels, prequels, spin-offs, and alternative adaptations.

---

## Methodologies & Architecture

### 1. Technology Stack
*   **Core Framework**: Next.js 15+ (App Router) with Dynamic IO and Partial Prerendering (PPR) enabled.
*   **Query Lifecycle Management**: TanStack React Query (v5) managing all client-side state, server-state synchronization, and request deduplication.
*   **Data Source**: AniList GraphQL API queried via a type-safe generated client (`codegen`).
*   **Design & UI System**: Custom dark-themed responsive styling built with Tailwind CSS, utilizing glassmorphism and modern typography (Outfit/Inter).
*   **Animations**: Motion components from `framer-motion` managing fluid page entries, hover-based card expansions, and bento-grid expansions.
*   **Visualizations**: Custom chart components utilizing `react-charts` adapted for React 19.

### 2. Caching Strategy
To minimize external API payloads and optimize deployment performance on edge networks:
*   **Server-Side Edge Caching**: Utilizes Next.js Cache Components and the `"use cache"` directive on API endpoints (`/api/explore-data` and `/api/watching-anime`) to cache heavy GraphQL responses directly on the deployment edge.
*   **Browser Cache Storage**: Employs the browser's native `Cache Storage API` inside client-side page hooks to cache static datasets (such as public carousel lists fetched via `/api/public-anime` and `/api/public-manga`), eliminating fetch latency on subsequent visits.
*   **Client State Caches**: Preconfigured React Query `staleTime` (5 minutes) and `gcTime` (10 minutes) parameters preventing duplicate requests during active browsing sessions.

### 3. Performance & Hover-Based Prefetching
To achieve near-zero-latency navigation, the application proactively pre-warms the cache when a user intends to interact with an element:
*   **Navigation & Hubs**: Hovering over the "Anime" or "Manga" links in the Navbar triggers a prefetch of the corresponding explore-data payload or initial category page.
*   **CTA Prefetching**: Landing page Call-to-Actions (such as search inputs or exploration buttons) prefetch primary datasets on hover.
*   **Media Cards**: Hovering over any bento card, poster card, or magazine tile immediately starts a parallel prefetch of the media's details, cast, staff, and statistics, ensuring the details page loads instantly on click.
*   **Partial Prerendering (PPR)**: Dynamic pages are isolated using `<Suspense>` loading boundaries (`loading.tsx`), allowing Next.js to serve compiled static layouts instantly while dynamic data streams in.

---

## Project Directory Structure

```
anima/
├── app/
│   ├── anime/               # Anime detail route segment & layout metadata
│   ├── manga/               # Manga explore and detail route segments
│   ├── api/                 # Caching proxies and narrative services
│   ├── components/          # Reusable UI (Navbar, Footer, Charts, Grids)
│   ├── constants/           # Styled card definitions and vector icons
│   └── globals.css          # Theme config and global Tailwind modifiers
├── src/
│   ├── anime/               # Anime-specific GraphQL schema queries
│   ├── manga/               # Manga-specific GraphQL schema queries
│   └── hooks/               # Custom data-fetching hooks with prefetch support
├── codegen.ts               # GraphQL code generation configurator
└── next.config.ts           # Next.js compiler settings and cache configs
```

---

## Getting Started

### Prerequisites
*   Node.js (v18+) & npm/pnpm
*   Docker & Docker Compose
*   *Optional*: NVIDIA Container Toolkit (for GPU-accelerated embedding and reranking services. If not available, see the CPU fallback note below).

### Setup & Run

#### 1. Spin up Backend Infrastructure
Navigate to the `cloud-setup` directory and start all background services (Postgres, Qdrant, Ollama, GTE Embeddings, MS-MARCO Reranker, and Nginx proxy):
```bash
cd cloud-setup
docker compose up -d
```
> [!NOTE]
> **CPU-Only Systems**: If you do not have an NVIDIA GPU, edit `cloud-setup/docker-compose.yml` to change the `tei-rerank` image to `ghcr.io/huggingface/text-embeddings-inference:cpu-1.6` and remove the `deploy` block (lines 51–57) containing GPU reservations before starting.

#### 2. Pull local Ollama LLM
The search query analyzer uses a Qwen model. Download it to the running Ollama container:
```bash
docker exec -it cloud_ollama ollama run qwen2.5:3b
```

#### 3. Restore the PostgreSQL Database
Seed the PostgreSQL instance with the pre-populated media database dump located in the root of the project:
```bash
docker exec -i cloud_postgres psql -U postgres -d anime_db < ../anime_db.sql
```

#### 4. Run the Dev Server
Return to the main directory, install packages, and boot up the Next.js frontend:
```bash
cd ..
npm install
npm run dev
```
The app will be accessible at [http://localhost:3000](http://localhost:3000).

#### 5. Production Build
Verify the production build compiles cleanly:
```bash
npm run build
```
