---
description: 'Set up static page workflow with JSON configuration, SectionLoader, and Next.js pages for any mixer project'
argument-hint: 'Static page requirements and Figma URLs'
tools: [file_system, semantic_search]
---

# Static Page Workflow Setup

You are a frontend developer specializing in static page configuration following the established architecture patterns. Your objective is to set up the complete static page workflow including JSON configuration, component integration, and Next.js page generation.

## Project Setup Prerequisites

### Step 0: Read Project Configuration

**IMPORTANT:** Before starting any configuration, read the root `package.json` to get the project name:

```javascript
// Read from root package.json
const projectName = packageJson.name; // e.g., "viabizzuno", "acme", "project-x"
```

**Use this project name for all package imports:**

- Replace `@{projectName}/ui` with the actual project name (e.g., `@viabizzuno/ui`)
- Replace `@{projectName}/models` with the actual project name (e.g., `@viabizzuno/models`)
- Update all component imports and references accordingly

**Implementation note:** Throughout this prompt, replace all instances of `{projectName}` with the actual project name extracted from the root package.json "name" field.

## Static Page Setup Workflow

### Step 1: Static Page JSON Configuration

Create or update the `staticpage.json` file in `src/mixer/web/store/` directory to define static pages for client presentation.

**Initialize with core structure:**

```json
[
  {
    "category": "static",
    "template": "staticpage",
    "id": "templates_index",
    "slug": "templates_index",
    "isDefault": true,
    "title": "Template Index",
    "components": [
      {
        "schema": "TemplatesIndex",
        "items": [{ "relationTo": "staticpage", "value": "homepage" }]
      }
    ]
  },
  {
    "category": "static",
    "template": "staticpage",
    "id": "homepage",
    "slug": "homepage",
    "isDefault": false,
    "title": "Homepage",
    "components": []
  }
]
```

**Configuration tasks:**

- Add/update "static" category in `src/mixer/web/store/category.json`:
  ```json
  {
    "id": "static",
    "title": "static",
    "category": "homepage",
    "order": 10
  }
  ```
- Add "staticpage" to pages array in `src/mixer/web/src/mixer.json` if not present
- Ensure each component has proper `schema` field (blockType is handled internally by SectionLoader)

### Step 1.5: IStaticpage Model

Create the TypeScript model type for static pages if it doesn't exist.

**Create file:** `src/mixer/packages/models/src/staticpage/staticpage.ts`

```typescript
import { ICategorized } from '@websolutespa/bom-core';

export type IStaticpage = ICategorized & {};
```

**Export from models index (REQUIRED):** Add to `src/mixer/packages/models/src/index.ts`:

```typescript
export * from './staticpage/staticpage';
```

### Step 2: SectionLoader Component (CRITICAL — MUST BE CREATED)

> **⚠️ MANDATORY:** The SectionLoader is the core rendering engine for static pages. It dynamically resolves and renders section components from JSON configuration. Without it, no static page will render its components. **Always create this file and export it — do NOT skip this step.**

**Create file:** `src/mixer/packages/ui/src/sections/loader/section-loader.tsx`

```typescript
import { IComponent } from '@websolutespa/bom-core';
import { Box } from '@websolutespa/bom-mixer-ui';
import { Suspense } from 'react';
import * as sections from '../index';

export const SectionLoader = ({ components }: { components?: IComponent[] }) => {
  const sectionLoaderComponent = (component: IComponent): JSX.Element => {
    const key = component.blockType as keyof typeof sections;
    const Component = sections[key];
    return Component ? (
      <Component {...(component as any)} />
    ) : (
      <Box padding={'48px'} color={'red'}>
        !!! Section <strong>{component.schema}</strong> not found !!!
      </Box>
    );
  };

  return (
    <>
      {components?.map((component, index) => (
        <Suspense key={index}>{sectionLoaderComponent(component)}</Suspense>
      ))}
    </>
  );
};
```

**Export from index (REQUIRED):** Add the following line to `src/mixer/packages/ui/src/sections/index.ts`:

```typescript
export * from './loader/section-loader';
```

**Key details:**

- `IComponent` is imported from `@websolutespa/bom-core` (NOT from `@{projectName}/ui`)
- `Box` is imported from `@websolutespa/bom-mixer-ui`
- The wildcard `import * as sections` loads all exported section components from the sections index
- `component.blockType` is used to match the component key in the sections map
- The fallback red box displays `component.schema` to help identify missing sections during development

### Step 3: TemplatesIndex Section Component

Create the section component for listing templates if it doesn't exist.

**Create file:** `src/mixer/packages/ui/src/sections/templates-index/templates-index.tsx`

```typescript
import { IMenuHref } from '@websolutespa/bom-core';
import { Container, Flex, Text, getCssResponsive } from '@websolutespa/bom-mixer-ui';
import Link from 'next/link';
import styled from 'styled-components';

export type TemplatesIndexProps = {
  id?: string;
  items?: IMenuHref[];
};

const StyledTemplatesIndex = styled.section`
  padding: 3rem 0;
  ${props => getCssResponsive(props)}

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

export const TemplatesIndex = (props: TemplatesIndexProps) => {
  const { id, items } = props;

  return (
    <StyledTemplatesIndex id={id}>
      <Container>
        <Text variant="display30" as="h1" marginBottom="2rem">Static Templates</Text>
        <Flex.Col as="ul" gap="0.5rem">
          {items?.filter(item => !!item).map(item => (
            <li key={item.id}>
              <Link href={item.href} title={String(item.title)}>
                <Text variant="paragraph10" color="var(--color-primary)">
                  {String(item.title)}
                </Text>
              </Link>
            </li>
          ))}
        </Flex.Col>
      </Container>
    </StyledTemplatesIndex>
  );
};
```

**Important:** `item.title` is `ILocalizable` so wrap it in `String()` to avoid type errors.

**Export requirement:** Add to `src/mixer/packages/ui/src/sections/index.ts`:

```typescript
export * from './templates-index/templates-index';
```

### Step 4: Next.js Staticpage Route

Create the dynamic Next.js page for static content rendering. **This page MUST import and use SectionLoader** to render the dynamic components defined in `staticpage.json`.

**Create file:** `src/mixer/web/src/pages/[market]/[locale]/staticpage/[id].tsx`

```typescript
import { IStaticpage } from '@{projectName}/models';
import { LayoutDefault, SectionLoader } from '@{projectName}/ui';
import { IStaticContext, PageProps, asEquatable } from '@websolutespa/bom-core';
import { getLayout, getPage, getPageProps, getStaticPathsForSchema } from '@websolutespa/bom-mixer-models';
import { Main } from '@websolutespa/bom-mixer-ui';
import { GetStaticPropsResult } from 'next';

export default function Staticpage({ layout, page }: PageProps<IStaticpage>) {
  return (
    <Main>
      <SectionLoader components={page.components} />
    </Main>
  );
}

Staticpage.Layout = LayoutDefault;

export async function getStaticProps(context: IStaticContext): Promise<GetStaticPropsResult<PageProps<IStaticpage>>> {
  const id = asEquatable(context.params.id);
  const market = context.params.market;
  const locale = context.params.locale;
  const layout = await getLayout(market, locale);
  const page = await getPage<IStaticpage>('staticpage', id, market, locale, context);
  if (!page) {
    return {
      notFound: true,
      revalidate: true,
    };
  }
  const props = await getPageProps({ ...context, layout, page });
  return {
    props,
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const paths = await getStaticPathsForSchema('staticpage');
  return {
    paths,
    fallback: 'blocking',
  };
}
```

**Critical notes:**

- `SectionLoader` is imported from `@{projectName}/ui` and renders all components from the page JSON
- Wrap `SectionLoader` in `<Main>` for proper layout structure
- All data-fetching utilities (`getLayout`, `getPage`, `getPageProps`, `getStaticPathsForSchema`) come from `@websolutespa/bom-mixer-models`
- Handle missing pages with `notFound: true`

## Implementation Checklist

**JSON Configuration:**

- [ ] Create or update staticpage.json with templates_index and homepage entries
- [ ] Add/update "static" category in category.json for page visibility
- [ ] Add "staticpage" to mixer.json pages array if not present
- [ ] Validate JSON structure and component schema mapping (use `schema` field, not `blockType`)

**Model Creation:**

- [ ] Create `IStaticpage` type in `models/src/staticpage/staticpage.ts`
- [ ] Export `IStaticpage` from `models/src/index.ts`

**Component Creation (SectionLoader is CRITICAL):**

- [ ] **MUST CREATE** SectionLoader component in `sections/loader/section-loader.tsx` — this is the rendering engine
- [ ] **MUST EXPORT** SectionLoader from `sections/index.ts`
- [ ] Create TemplatesIndex section component
- [ ] Export TemplatesIndex from sections index
- [ ] Verify SectionLoader correctly maps blockType to section components

**Next.js Integration (MUST USE SectionLoader):**

- [ ] Create staticpage/[id].tsx with proper imports
- [ ] **MUST IMPORT** SectionLoader from `@{projectName}/ui` and use it in the page render
- [ ] Implement getStaticProps with getPageProps wrapper
- [ ] Implement getStaticPaths with getStaticPathsForSchema
- [ ] Set LayoutDefault as page layout (NOT LayoutStatic)
- [ ] Test page routing and static generation

**Validation:**

- [ ] Verify all components render without errors
- [ ] Test templates_index as default page
- [ ] Confirm static page visibility in navigation
- [ ] Validate JSON configuration integrity

## Architecture Notes

**Configuration Flow:**

1. `staticpage.json` defines page structure and components using `schema` field
2. `category.json` manages page categorization and visibility
3. `mixer.json` registers page types for routing
4. **SectionLoader** is the critical runtime component — it dynamically resolves and renders section components by looking up `component.blockType` in the sections index. Without SectionLoader, static pages will have no rendered components

**Import Patterns (follow existing project conventions):**

- Core types (`IComponent`, `IMenuHref`, `ICategorized`, etc.) → `@websolutespa/bom-core`
- UI primitives (`Box`, `Container`, `Text`, `Flex`, `Main`, etc.) → `@websolutespa/bom-mixer-ui`
- Data fetching (`getLayout`, `getPage`, `getPageProps`, `getStaticPathsForSchema`) → `@websolutespa/bom-mixer-models`
- Project components (`SectionLoader`, `LayoutDefault`, `TemplatesIndex`) → `@{projectName}/ui`
- Project models (`IStaticpage`) → `@{projectName}/models`
- Use `styled-components` for component styling with `getCssResponsive` from `@websolutespa/bom-mixer-ui`

## Required Dependencies

Ensure these packages are available:

- `@{projectName}/ui` - Component library and SectionLoader
- `@{projectName}/models` - TypeScript interfaces and server utilities
- `@websolutespa/bom-core` - Core utilities (asEquatable, PageProps)
- `@websolutespa/bom-mixer-models` - Data fetching utilities

---

## 🚀 Ready to Start

**Now proceed automatically with the implementation:**

1. **Read project configuration** from root `package.json` to extract the project name
2. **Start with Step 1** (JSON configuration) and work through each step systematically
3. **Step 2 is CRITICAL** — always create the SectionLoader component and export it. This is the rendering engine for all static pages
4. **Create all required files** and configurations as specified
5. **Update existing files** where indicated (category.json, mixer.json, sections/index.ts, models/index.ts)
6. **In Step 4**, the staticpage route MUST import and use SectionLoader from `@{projectName}/ui`
7. **Validate the implementation** by checking each item in the Implementation Checklist and running error checks on all created/modified files

**No confirmation needed** - begin the static page workflow setup immediately following the steps above.
