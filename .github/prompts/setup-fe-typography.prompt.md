---
description: 'Extract typography variables from Figma and apply them to theme.json'
argument-hint: 'Figma URL for typography extraction'
tools: [mcp_my-mcp-server_get_design_context, mcp_my-mcp-server_get_variable_defs, file_system, semantic_search]
---

# Figma Typography Setup

You are a frontend developer specializing in design token extraction from Figma. Your objective is to extract typography variables from Figma and apply them **exclusively** to `theme.json`.

## CRITICAL RULES — READ FIRST

> **NEVER modify `global.vars.ts` or `global.vars.scss`.**
> These files are **auto-generated** by the `bom vars` CLI from `theme.json`.
> Any manual edits will be overwritten on the next build.
>
> **NEVER write font/typography CSS custom properties** (e.g. `--font-*`) anywhere.
> Typography CSS variables are auto-generated from `theme.json` when running `bom vars`.
> You only need to edit `theme.json` for typography — the rest is automated.
>
> **NEVER modify `global.style.ts`.**
> This prompt handles typography only. Colors and spacing are managed by a separate prompt.

### Target file

| Variable type                                                | Target file  | Notes                                                  |
| ------------------------------------------------------------ | ------------ | ------------------------------------------------------ |
| **Typography** (font sizes, weights, line-heights, families) | `theme.json` | Only the `"font"` object — CSS vars are auto-generated |

## Project Setup Prerequisites

### Step 0: Read Project Configuration

Read the root `package.json` to get the project name and use it for all package paths throughout the implementation.

## Typography Extraction Workflow

### Step 1: Request Figma URL and Extract Typography Variables

If the user has not already provided a Figma URL:
**Ask user directly:** "Please provide the Figma file URL for typography extraction"

**Extract variables using MCP:**

```javascript
await mcp_get_variable_defs(figmaUrl); // Gets ALL variables — filter for typography
```

From the extracted variables, **filter only typography-related tokens**: font sizes, line heights, font weights, font families, and text style definitions.

### Step 2: Analyze Extracted Typography

Organize the extracted typography into variant groups. Typical groups found in Figma:

- **Display**: Large hero/headline styles (display1, display2, etc.)
- **Heading**: Section headings (heading1, heading2, heading3, heading4, etc.)
- **Body**: Paragraph/content text (body1, body2, body3, etc.)
- **CTA**: Call-to-action button text (cta1, cta2, cta3, etc.)
- **Label**: Small UI text, captions (label1, label2, etc.)

For each variant, extract:

- **Desktop font size** (px from Figma → convert to rem)
- **Mobile font size** (px from Figma → convert to rem) — look for mobile/responsive variants
- **Line height** (as percentage, e.g. `"120%"`)
- **Font weight** (numeric value: 400, 500, 600, 700, etc.)
- **Font family** (with fallback stack)

### Step 3: Update `theme.json` — REPLACE the `"font"` object

**File:** `src/mixer/packages/ui/src/theme/theme.json`

**COMPLETELY REPLACE the existing `"font"` object** with Figma-derived typography.

#### Clamp Formula

Generate responsive clamp values for each font size using this formula:

```
clamp(mobileRem, calc(mobileRem + (desktopRem - mobileRem) * (100vw - 375px) / 1545), desktopRem)
```

- **Mobile breakpoint:** 375px
- **Desktop breakpoint:** 1920px
- **Difference:** 1920 - 375 = 1545

#### Conversion: px → rem

Divide Figma pixel values by 10 (the project uses `font-size: 62.5%` on `<html>`, so `1rem = 10px`).

> **Check this assumption:** Read the existing `theme.json` or `global.style.ts` to verify the base font-size. If the project uses `font-size: 100%` (1rem = 16px), divide by 16 instead.

#### Example structure

```json
{
  "font": {
    "display1": {
      "size": "clamp(2.5rem, calc(2.5rem + (4 - 2.5) * (100vw - 375px) / 1545), 4rem)",
      "lineHeight": "120%",
      "fontWeight": 700,
      "fontFamily": "Montserrat, sans-serif"
    },
    "heading1": {
      "size": "clamp(1.75rem, calc(1.75rem + (2.5 - 1.75) * (100vw - 375px) / 1545), 2.5rem)",
      "lineHeight": "130%",
      "fontWeight": 600,
      "fontFamily": "Montserrat, sans-serif"
    },
    "body1": {
      "size": "clamp(1rem, calc(1rem + (1.125 - 1) * (100vw - 375px) / 1545), 1.125rem)",
      "lineHeight": "150%",
      "fontWeight": 400,
      "fontFamily": "Inter, sans-serif"
    }
  }
}
```

**Requirements:**

- **REPLACE entire `"font"` object** — do not merge with or keep existing values
- **Generate responsive clamp values** for mobile (375px) to desktop (1920px)
- **Include ALL typography variants** found in Figma (display, heading, body, label, cta, etc.)
- **Use Figma font family names** with appropriate fallback stack
- **Preserve all other keys** in `theme.json` — only replace `"font"`
- **DO NOT write `--font-*` CSS variables anywhere** — they are auto-generated by `bom vars`

### Step 4: Verify Font Loading

Check that the font families used in `theme.json` are properly loaded in the project:

1. **Search for font-face declarations** or font loading configuration in the project
2. **Verify font files exist** in the assets directory if using self-hosted fonts
3. **Check Next.js font configuration** if using `next/font`

If a font referenced in Figma is NOT loaded in the project, **warn the user** with specific instructions on how to add it.

## Implementation Checklist

- [ ] Request and receive Figma URL from user
- [ ] Extract variables using MCP `get_variable_defs` tool
- [ ] Filter typography-related tokens from extraction results
- [ ] Identify all typography variant groups (display, heading, body, cta, label, etc.)
- [ ] For each variant: extract desktop size, mobile size, line-height, weight, family
- [ ] Verify base font-size assumption (62.5% vs 100%) by reading existing project files
- [ ] Convert px values to rem using correct base
- [ ] Generate clamp formulas for responsive scaling
- [ ] REPLACE the `"font"` object in `theme.json` — preserve all other keys
- [ ] Verify font families are loaded in the project
- [ ] **Confirm NO changes were made to** `global.vars.ts`, `global.vars.scss`, or `global.style.ts`

## Architecture Notes

**File Structure:**

- `theme.json` → Typography variables (`"font"` object only)
- `global.vars.ts` / `global.vars.scss` → **AUTO-GENERATED** from `theme.json` by `bom vars` — never edit
- `global.style.ts` → Colors and spacing (handled by separate prompt) — do not touch

**Responsive Design:**

- Mobile breakpoint: 375px
- Desktop breakpoint: 1920px
- Clamp formula: `clamp(min, calc(min + (max - min) * (100vw - 375px) / 1545), max)`
- All sizes in rem units

**Variable Naming:**

- Use Figma style names converted to camelCase keys in `theme.json`
- Example: "Display 1" → `display1`, "Heading 2" → `heading2`, "Body 1" → `body1`

---

## 🚀 Ready to Start

**Now proceed automatically with the implementation:**

1. **Request Figma URL** from the user (if not already provided)
2. **Extract variables** using MCP `get_variable_defs` tool
3. **Filter and organize** typography tokens from the extraction
4. **Verify base font-size** assumption by reading existing project files
5. **REPLACE the `"font"` object** in `theme.json` with Figma-derived typography
6. **Verify font loading** configuration
7. **Validate** using the checklist above

**No confirmation needed** — begin the typography extraction workflow immediately.
