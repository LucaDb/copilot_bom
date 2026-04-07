---
description: "Set up static page workflow with JSON configuration, SectionLoader, and Next.js pages for any mixer project"
argument-hint: "Static page requirements and Figma URLs"
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
        "items": [
          { "relationTo": "staticpage", "value": "homepage" }
        ]
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

### Step 2: SectionLoader Component
Create the dynamic section loading component if it doesn't exist.

**Create file:** `src/mixer/packages/ui/src/sections/loader/section-loader.tsx`

```typescript
import { Suspense } from 'react';
import * as sections from '../index';
import { Box } from '@{projectName}/ui';

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

**Export from index:** Ensure SectionLoader is exported from `src/mixer/packages/ui/src/sections/index.ts`

### Step 3: TemplatesIndex Section Component  
Create the section component for listing templates if it doesn't exist.

**Create file:** `src/mixer/packages/ui/src/sections/templates-index/templates-index.tsx`

```typescript
import { Container, Text, Flex, Link } from '@{projectName}/ui';

export type TemplatesIndexProps = {
  id?: string;
  items?: IMenuHref[];
};

export const TemplatesIndex = (props: TemplatesIndexProps) => {
  const { id, items } = props;
  
  return (
    <StyledTemplatesIndex id={id}>
      <Container.Fluid>
        <Text variant="display1">Static Templates</Text>
        <Flex.Col as="ul">
          {items?.filter(item => !!item).map(item => (
            <li key={item.id}>
              <Link href={item.href} title={item.title}>
                <Text variant="body1" color="primary">
                  {item.title}
                </Text>
              </Link>
            </li>
          ))}
        </Flex.Col>
      </Container.Fluid>
    </StyledTemplatesIndex>
  );
};

const StyledTemplatesIndex = styled.section`
  // Add styling here
`;
```

**Export requirements:** Add to `src/mixer/packages/ui/src/sections/index.ts`

### Step 4: Next.js Staticpage Route
Create the dynamic Next.js page for static content rendering.

**Create file:** `src/mixer/web/src/pages/[market]/[locale]/staticpage/[id].tsx`

```typescript
import { IStaticpage } from '@{projectName}/models';
import { LayoutStatic, SectionLoader } from '@{projectName}/ui';
import { getPageProps } from '@{projectName}/ui/server';
import { asEquatable, IStaticContext, PageProps } from '@websolutespa/bom-core';
import { 
  getPage,
  getStaticPathsForSchema,
} from '@websolutespa/bom-mixer-models/server';
import { getLayout } from '@{projectName}/models/server';

export default function Staticpage({ layout, page }: PageProps<IStaticpage>) {
  return <SectionLoader components={page.components} />;
}

Staticpage.Layout = LayoutStatic;

export async function getStaticProps(context: IStaticContext) {
  const id = asEquatable(context.params.id);
  const market = context.params.market;
  const locale = context.params.locale;
  
  const layout = await getLayout(market, locale);
  const page = await getPage<IStaticpage>(
    'staticpage',
    id,
    market,
    locale,
    context
  );
  
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

### Step 5: Design Token Integration (Optional)
If Figma integration is needed, extract basic typography and color variables to ensure components render properly.

**Request from user:**
- "Please provide the Figma file URL for variable extraction"

**Extract and apply:**
- Typography variables to components (use existing theme.json structure)
- Color variables for component styling
- Update TemplatesIndex component to use extracted variables

## Implementation Checklist

**JSON Configuration:**
- [ ] Create or update staticpage.json with templates_index and homepage entries
- [ ] Add/update "static" category in category.json for page visibility
- [ ] Add "staticpage" to mixer.json pages array if not present
- [ ] Validate JSON structure and component schema mapping (use `schema` field, not `blockType`)

**Component Creation:**
- [ ] Create SectionLoader component with proper error handling
- [ ] Export SectionLoader from sections index
- [ ] Create TemplatesIndex section component
- [ ] Export TemplatesIndex from sections index
- [ ] Test dynamic component loading

**Next.js Integration:**
- [ ] Create staticpage/[id].tsx with proper imports
- [ ] Implement getStaticProps with getPageProps wrapper
- [ ] Implement getStaticPaths with getStaticPathsForSchema
- [ ] Set LayoutStatic as page layout
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
4. SectionLoader dynamically renders components by mapping `schema` to `blockType` internally

**Component Pattern:**
- Each section component exports proper TypeScript interface
- SectionLoader maps component `schema` field to `blockType` for dynamic loading
- **Important**: Only use `schema` in staticpage.json - `blockType` is handled internally
- Suspense wrapping enables lazy loading
- Error boundaries show missing component warnings

**Next.js Integration:**
- Dynamic routing through `[id].tsx` parameter
- Static generation with ISR (revalidate: 60)
- Proper TypeScript typing with PageProps interface
- Layout system integration via `Staticpage.Layout`

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
2. **Start with Step 1** and work through each step systematically  
3. **Create all required files** and configurations as specified
4. **Update existing files** where indicated (category.json, mixer.json)
5. **Validate the implementation** by checking each item in the Implementation Checklist

**No confirmation needed** - begin the static page workflow setup immediately following the steps above.
