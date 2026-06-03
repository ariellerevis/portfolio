---
name: Deep Sea Descent
colors:
  surface: '#fef7ff'
  surface-dim: '#e0d7e5'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf0ff'
  surface-container: '#f4ebf9'
  surface-container-high: '#eee5f3'
  surface-container-highest: '#e8dfed'
  on-surface: '#1e1a24'
  on-surface-variant: '#4b4454'
  inverse-surface: '#332e39'
  inverse-on-surface: '#f7edfc'
  outline: '#7c7486'
  outline-variant: '#cdc2d7'
  surface-tint: '#7a2edc'
  primary: '#6500c7'
  on-primary: '#ffffff'
  primary-container: '#7e33e0'
  on-primary-container: '#e9d7ff'
  inverse-primary: '#d6baff'
  secondary: '#3d5f91'
  on-secondary: '#ffffff'
  secondary-container: '#a3c5fd'
  on-secondary-container: '#2e5182'
  tertiary: '#4c4a43'
  on-tertiary: '#ffffff'
  tertiary-container: '#64625a'
  on-tertiary-container: '#e2ded4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eddcff'
  primary-fixed-dim: '#d6baff'
  on-primary-fixed: '#280056'
  on-primary-fixed-variant: '#6000be'
  secondary-fixed: '#d5e3ff'
  secondary-fixed-dim: '#a7c8ff'
  on-secondary-fixed: '#001c3b'
  on-secondary-fixed-variant: '#234777'
  tertiary-fixed: '#e7e2d8'
  tertiary-fixed-dim: '#cac6bd'
  on-tertiary-fixed: '#1d1c16'
  on-tertiary-fixed-variant: '#494740'
  background: '#fef7ff'
  on-background: '#1e1a24'
  surface-variant: '#e8dfed'
  sunlight: '#FFFAF0'
  midnight: '#0B3665'
  hadal: '#000000'
  ink-dark: '#0A0A0A'
  clay-mint: '#A4D4C5'
  clay-lavender: '#B8A4ED'
  clay-yellow: '#E8B94A'
  clay-peach: '#FFB084'
  clay-ochre: '#C49B35'
  notion-hairline: '#E5E5E5'
typography:
  display-xl:
    fontFamily: Oswald
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: -2px
  display-lg:
    fontFamily: Oswald
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.10'
    letterSpacing: -1px
  display-lg-mobile:
    fontFamily: Oswald
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.10'
    letterSpacing: -0.5px
  headline-md:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.20'
    letterSpacing: 0px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.50'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.55'
  label-bold:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.20'
    letterSpacing: 0.5px
  nav-link:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px
  gutter: 32px
---

## Brand & Style

The design system creates a narrative of discovery, transitioning from the warm, airy "Sunlight Zone" to the pressurized, technical "Hadal Zone." It targets a creative yet technically-minded audience, evoking curiosity through a mix of high-fidelity 3D claymation and structured, professional productivity aesthetics.

The visual style is a **Tactile-Corporate Hybrid**. It blends the friendly, squishy world of claymation (inspired by Clay.com) with the sober, functional clarity of a personal workspace (inspired by Notion). This creates a "Scientific Playfulness" where high-level achievements are anchored by whimsical, deep-sea biological metaphors.

The 'A' monogram logo follows the sketch's organic yet structured form, serving as a constant anchor in the navigation bar. Decorative "sticky-note dots" and "mesh wire" SVGs are scattered throughout, mimicking both office supplies and marine bioluminescence.

## Colors

The palette is structured around a **Vertical Depth Spectrum**. 
- **The Surface (Sunlight):** Uses a warm cream canvas (#FFFAF0) as the base for the "About" and "Leadership" sections. 
- **The Descent (Midnight):** Transitions into deep navy (#0B3665) for the "Work" and "Projects" sections.
- **The Abyss (Hadal):** Culminates in a Pitch Black (#000000) footer/contact area.

Brand accents leverage the Notion Signature Purple (#7E33E0) for all primary interactive elements and conversion points. Feature cards utilize Clay’s pastel palette—mint, lavender, yellow, peach, and ochre—to categorize different types of achievements or project sectors. These saturated colors are paired with high-contrast ink-dark text or white depending on the background luminance.

## Typography

Typography establishes a "Technical-Impact" voice. **Oswald** is used exclusively for display headlines, set with bold weights and tight letter-spacing to create a pressurized, impactful look that mimics underwater depth gauges.

**Inter** serves as the primary engine for body text, providing high legibility and a neutral, professional "workspace" feel. **Roboto** is utilized for UI labels, navigation links, and the vertical Depth Meter, offering a slightly more mechanical feel that complements the oceanic-expedition theme. As the user scrolls deeper, font colors transition from Ink-Dark to White to maintain legibility against the darkening canvas.

## Layout & Spacing

The design system employs a **12-column Fluid Grid** with a maximum content width of 1280px. Spacing follows a strict 8px incremental rhythm, ensuring consistency across tactile clay elements and rigid Notion-inspired mockups.

- **Sectioning:** Major oceanic zones are separated by 96px vertical padding.
- **Grids:** Project cards (Notion style) are arranged in 3-up or 2-up grids, while Feature cards (Clay style) often occupy larger column spans (6 or 8 columns) to showcase 3D illustrations.
- **Responsivity:** On mobile, the grid collapses to a single column, and display typography scales down (e.g., 80px to 36px) to ensure the bold "Oswald" headings remain readable.

## Elevation & Depth

Hierarchy is achieved through a combination of **Tonal Layering** and **Tactile Volumes**.

1.  **Sunlight Layers:** In the upper zones, depth is conveyed through soft hairline outlines (1px #E5E5E5) and subtle tonal shifts in the cream background. Shadows are largely avoided here to maintain a "clean paper" feel.
2.  **Clay Volume:** Clay-style cards use saturated fills without shadows, relying on the 3D claymation assets inside them to provide the illusion of physical extrusion.
3.  **Abyssal Depth:** In the Midnight and Hadal zones, elements use **Ambient Glows** (bioluminescence) instead of shadows. Objects appear to float within the deep navy, highlighted by subtle inner glows and purple backlighting from the primary brand color.

## Shapes

The shape language is a deliberate contrast between two distinct radii:
- **Clay-Card Radius:** 24px (rounded-xl) for large, saturated feature cards. This generous rounding mirrors the "squishy" nature of the 3D claymation assets.
- **Notion-Mockup Radius:** 12px (rounded-lg) for project cards and technical mockups. This tighter radius communicates precision and structure.
- **Interactive Radius:** 8px (rounded-md) for buttons and input fields, providing a sober, editorial finish that feels reliable.

## Components

### Depth-Meter
A fixed vertical track on the right edge of the viewport. It features a progress indicator that moves as the user scrolls, with text labels (Sunlight, Twilight, Midnight, Abyssal, Hadal) appearing next to the dots.

### Clay-Card
High-impact containers with a 24px radius and saturated backgrounds from the Clay palette. They contain no shadows and are used to highlight major awards or "Sea-Creature" illustrations.

### Notion-Mockup
Structured cards for project display with a 12px radius and a 1px hairline border. These should feel like clean, digital workspaces, often featuring a white or light-gray face even when the surrounding section is dark navy.

### Notion-CTA
The primary action button. Rectangular with an 8px radius, utilizing the Signature Purple (#7E33E0). It uses "White" text for maximum contrast.

### Sea-Creature Containers
Rounded containers (radius 24px or full) that house 3D/Claymation marine illustrations. These assets should break the "bounding box" of the grid occasionally to create a sense of life and movement.

### Depth-Markers
Sticky horizontal bars that appear at the start of each new zone (e.g., "Midnight Zone: 1000m - 4000m"). They use pill-shaped containers with a blur background (Glassmorphism) to feel like instrument readouts on a submersible.