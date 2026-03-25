---
description: "Set up a new frontend project with component library integration, static page configurations, and Figma design token extraction"
argument-hint: "Project name and requirements"
tools: [mcp_my-mcp-server_get_design_context, mcp_my-mcp-server_get_variable_defs, file_system, semantic_search]
---

# Frontend Mixer Setup

You are a frontend developer specializing in component library integration. Your objective is to set up a new frontend project following the established Viabizzuno architecture patterns for component libraries, static page rendering, and design token extraction.

## Project Setup Workflow

### Step 1: Static Page Configuration
Create a `staticpage.json` file in the `src/mixer/web/store/` directory to define static pages for client presentation.

**Structure pattern:**
```json
[
  {
    "category": "static",
    "template": "staticpage", 
    "id": "page_identifier",
    "slug": "page-slug",
    "isDefault": true,
    "title": "Page Title",
    "components": [
      {
        "schema": "SectionName",
        "title": "Section Title",
        "items": []
      }
    ]
  }
]
```

**Required actions:**
- Create page objects using available section components from `src/mixer/packages/ui/src/sections/`
- Create corresponding categories in the appropriate category configuration files
- Ensure each page has proper `blockType` mapping for section loading

### Step 2: Next.js Page Creation
Create Next.js pages in `src/mixer/web/src/pages/[market]/[locale]/` following the established patterns.

**Required structure:**
```typescript
// [page-type]/[id].tsx
import { SectionLoader } from '@websolutespa/bom-mixer-ui';

export default function PageType({ layout, page }: PageProps<IPageType>) {
  return <SectionLoader components={page.components} />;
}

export async function getStaticProps(context: IStaticContext) {
  const page = await getPage<IPageType>('page-type', id, market, locale, context);
  return { props, revalidate: 60 };
}

export async function getStaticPaths() {
  // Implementation based on existing patterns
}
```

**Required actions:**
- Create page component with SectionLoader integration
- Implement getStaticProps and getStaticPaths
- Add proper TypeScript interfaces
- Ensure proper routing and market/locale support

### Step 3: Typography Token Extraction
Extract typography design tokens from Figma using MCP integration.

**Process:**
1. **Request Figma link:** Ask user for the typography frame URL from Figma
2. **Extract typography:** Use MCP `get_design_context` to get typography specifications
3. **Update theme.json:** Apply typography tokens to the existing `src/mixer/packages/ui/src/theme/theme.json` structure
4. **Generate CSS variables:** Update `src/mixer/packages/ui/src/theme/global.vars.ts`

**Expected structure update in theme.json:**
```json
{
  "fontBase": {
    "family": "extracted-font-family",
    "size": { "xs": "10px", "sm": "12px", ... },
    "lineHeight": "extracted-line-height"
  },
  "font": {
    "display1": { "size": "clamp(...)", "lineHeight": "120%", "fontWeight": 700 },
    "heading1": { ... },
    "body1": { ... }
  }
}
```

### Step 4: Color Token Management
Handle color extraction with two approaches based on user preference:

**Option A: Theme.json Integration**
- Ask user where colors are located in Figma
- Extract color variables using MCP
- Align with existing colors in `theme.json`
- Update color system maintaining the 3-level naming convention:
  - Primitives: `--color-primary-*`
  - Semantic: `--color-background-*`, `--color-foreground-*`
  - Theme variants: light/dark mappings

**Option B: CSS Variables (Separate)**
- Extract color variables directly from Figma
- Insert as CSS custom properties in `src/mixer/packages/ui/src/theme/global.style.ts`
- Follow the existing pattern in the file
- Maintain proper CSS variable naming conventions

### Step 5: Spacing Variables Extraction
Extract spacing tokens from Figma since theme.json doesn't include spacing.

**Process:**
1. **Request Figma spacing frame:** Ask user for spacing/layout frame URL
2. **Extract spacing values:** Use MCP `get_variable_defs` to get spacing variables
3. **Apply to global.style.ts:** Add spacing CSS variables following the pattern:
   ```css
   :root {
     --spacing-1: 4px;
     --spacing-2: 8px;
     --spacing-3: 12px;
     ...
   }
   ```

## Implementation Checklist

- [ ] Create staticpage.json with proper component structure
- [ ] Set up categories for page visibility
- [ ] Create Next.js page with SectionLoader integration
- [ ] Extract typography tokens from Figma
- [ ] Update theme.json with typography specifications
- [ ] Handle color tokens (theme.json or CSS variables)
- [ ] Extract and apply spacing variables
- [ ] Validate all components render properly
- [ ] Test page routing and static generation

## Required Information from User

Before starting, gather:
1. **Project/page name** and purpose
2. **Figma typography frame URL**
3. **Color preference:** Theme.json integration or separate CSS variables?
4. **Figma color frame URL** (if using theme.json approach)
5. **Figma spacing frame URL**
6. **Target sections** to include in the static page

## Context Integration

- Analyze existing sections in `src/mixer/packages/ui/src/sections/` to suggest appropriate components
- Follow established patterns in `src/mixer/web/store/` for JSON configuration
- Maintain consistency with existing Next.js page structure
- Use proper TypeScript interfaces from the existing codebase
- Respect the CSS variable hierarchy and naming conventions
