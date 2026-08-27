---
name: Loyal Luxury
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e5e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#46464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76767e'
  outline-variant: '#c6c6ce'
  surface-tint: '#575d78'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#141a32'
  on-primary-container: '#7c839f'
  inverse-primary: '#bfc5e4'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1c19'
  on-tertiary-container: '#858480'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#bfc5e4'
  on-primary-fixed: '#141a32'
  on-primary-fixed-variant: '#3f465f'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#e5e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#474743'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e5e2e4'
  champagne-light: '#E5D4B1'
  navy-muted: '#1C2541'
  ink-black: '#050814'
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  margin-desktop: 80px
  margin-mobile: 24px
  gutter: 32px
  section-gap: 120px
---

## Brand & Style
The design system embodies a "Loyal Luxury" aesthetic, moving away from utilitarian industrialism toward a world of prestige, heritage, and quiet authority. The brand personality is that of a "Trusted Consiglieri"—highly professional, deeply loyal, and uncompromisingly premium. 

The visual style is a blend of **Minimalism** and **High-Contrast / Bold** elegance. It prioritizes extreme whitespace to signify "luxury of space," utilizing thin gold accents and a sophisticated dark palette to evoke a sense of exclusive membership. The UI should feel curated rather than manufactured, evoking the emotional response of entering a high-end private club or a heritage financial institution.

## Colors
The palette is a classic study in contrast. **Midnight Navy** (#0A1128) serves as the primary foundation, used for text, primary backgrounds, and structural elements to establish authority. **Sophisticated Gold** (#C5A059) is used as a strategic accent—appearing in borders, icons, and curated interactive states to signify premium value.

The neutral system shifts from cold grays to a warm **Champagne/Off-White** (#F8F5F0) base. This warmer neutral creates a "paper-like" luxury feel, avoiding the clinical nature of pure white. Secondary interactions utilize "Navy Muted" for hover states, while "Ink Black" is reserved for high-contrast display typography.

## Typography
The typographic hierarchy relies on a sharp contrast between serif and sans-serif. **Playfair Display** provides a literary, authoritative voice for headlines. It should be typeset with generous vertical space to allow its high-contrast strokes to breathe.

**Hanken Grotesk** is the body typeface, chosen for its modern, clean, and understated professional feel. It acts as the functional anchor to the decorative serif. For metadata and small headers, use `label-caps` with increased letter spacing (0.15em) to mimic the engraving style of luxury branding.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain a sense of controlled, intentional composition. The content is centered within a 1200px container, flanked by expansive 80px margins. 

Whitespace is treated as a core design element, not "empty space." Vertical rhythm is governed by a `section-gap` of 120px, forcing a slower, more deliberate scrolling experience. On mobile, margins reduce to 24px, and the grid collapses to 1 column, but vertical breathing room must remain significant to maintain the prestige feel.

## Elevation & Depth
In a "Loyal Luxury" aesthetic, depth is conveyed through **Low-Contrast Outlines** and **Tonal Layers** rather than heavy shadows.

- **The Base:** All content sits on the Champagne (#F8F5F0) background.
- **Layers:** Use subtle 1px Gold (#C5A059 at 30% opacity) borders to define containers. 
- **Shadows:** If shadows are used, they must be "Invisible Shadows"—minimal blur, extremely low opacity (2-3%), and tinted with Navy to feel like part of the surface. 
- **Dividers:** Use hairline 0.5px dividers in Gold to separate content, creating a "stationery" feel.

## Shapes
The shape language is **Sharp (0)**. In luxury contexts, hard 90-degree corners convey a sense of architectural permanence, bespoke tailoring, and precision. This applies to buttons, input fields, cards, and images. 

Avoid all rounded corners unless the element is a functional circle (e.g., an avatar). The sharpness reinforces the authoritative and professional personality of the brand.

## Components

### Buttons
- **Primary:** Midnight Navy background with White or Champagne text. Sharp corners. Label in `label-caps`. 
- **Secondary:** Clear background with a 1px Gold border. Text in Midnight Navy.
- **Hover States:** Transitions should be slow and elegant (300ms+). A primary button might shift to a Gold background on hover.

### Input Fields
Inputs are minimalist: a single 1px Gold bottom border (underline style) or a very thin 1px Navy outline. Focus states should transform the border to a solid Gold with no glow, maintaining a clean, "pen-on-paper" look.

### Cards
Cards should not look like blocks floating in space. They are defined by thin Gold borders or subtle shifts in background color (e.g., a white card on a champagne background). Padding inside cards must be generous (minimum 40px).

### Dividers & Rules
The "Signature Divider" is a thin Gold line. It is used to separate sections or to underline headline groupings. This is the primary tool for visual hierarchy.

### Lists
Lists should be understated. Instead of bullets, use a small Gold dash or a high-contrast `label-caps` number. Ensure line heights for list items are significantly higher than standard body text to emphasize exclusivity and readability.