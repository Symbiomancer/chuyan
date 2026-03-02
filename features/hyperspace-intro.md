# Feature: 3D Hyperspace Intro Animation

**Status:** Complete
**Created:** 2026-03-02

## Overview

Screen-blanking 3D intro animation on the homepage using React Three Fiber. Camera flies through a starfield with planets, then the hanzi (初焰) sears into view before dissolving into the normal page.

## Components

- `components/SpaceIntro/index.tsx` - Orchestrator with phase state machine
- `components/SpaceIntro/StarField.tsx` - 5000 instanced star particles with streak elongation
- `components/SpaceIntro/SpaceDebris.tsx` - 4 asteroid/planet meshes (2 rocky, 2 glowing)
- `components/SpaceIntro/WarpCamera.tsx` - Camera shake controller
- `components/SpaceIntro/HanziSear.tsx` - Hanzi texture with additive blending sear-in
- `components/SpaceIntro/SkipButton.tsx` - Skip button (appears after 1s)

## Animation Phases (5.5s total)

1. **Hyperspace** (0-2.5s): Stars rush toward camera as elongated cyan streaks, planets fly past
2. **Decelerate** (2.5-3.5s): Stars slow, streaks shorten
3. **Sear** (3.5-4.5s): Hanzi burns in with additive blending glow
4. **Dissolve** (4.5-5.5s): Overlay fades, revealing DOM page beneath

## Key Decisions

- Stars move toward camera (camera stays at origin) to avoid floating-point jitter
- InstancedMesh for 5000 stars = 1 draw call
- Dynamic import with `ssr: false` for static export compatibility
- localStorage skip: intro plays once per browser, skipped on repeat visits
- Skippable after 1 second via button

## Dependencies Used

- three (already installed, was unused)
- @react-three/fiber (already installed, was unused)
- No new packages added

## Future Ideas

- Add motion blur post-processing during warp
- Nebula clouds as volumetric fog
- Sound effects (whoosh on warp, sizzle on sear)
- sessionStorage option for per-session replay
