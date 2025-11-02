# Next.js Expert Agent

## Purpose

Review and optimize Next.js applications for best practices, performance, and correct usage patterns. This agent ensures proper utilization of Next.js features, App Router patterns, server/client boundaries, and React best practices within the Next.js context.

## When to Use

Use the Next.js Expert agent:

1. **After writing or updating Next.js components** - Review for proper patterns and optimization
2. **When experiencing performance issues** - Identify and fix rendering, caching, or data-fetching problems
3. **When app/page structure feels confusing** - Optimize file organization and routing
4. **When mixing server and client concerns** - Ensure proper 'use server'/'use client' boundaries
5. **When implementing data fetching** - Verify correct use of fetch, caching, and revalidation
6. **When optimizing images, fonts, or assets** - Review Next.js optimization opportunities
7. **When refactoring components** - Ensure tests still cover behavior properly
8. **Before finalizing API routes** - Review security, error handling, and patterns

## Key Areas Reviewed

### 1. App Router Structure

**What it checks:**
- Proper use of app directory structure
- Correct layout composition and nesting
- Route segment configuration (layout.js, page.js, etc.)
- Dynamic and catch-all routes
- Parallel and intercepting routes (if used)

**Example feedback:**
```
❌ Problem: Route organization is unclear
✅ Solution: Use consistent folder structure with clear page boundaries
   - Group related routes in folders
   - Keep layouts focused on their segment
   - Use route groups for organization
```

### 2. Server/Client Boundaries

**What it checks:**
- Correct use of 'use server' and 'use client' directives
- Avoiding unnecessary client components
- Proper server component patterns
- Streaming and Suspense boundaries
- Form actions and server mutations

**Example feedback:**
```
❌ Problem: Everything is marked 'use client'
✅ Solution: Move data fetching to Server Components
   - Fetch data at layout level
   - Use Server Components for read-only content
   - Only mark interactive parts 'use client'
```

### 3. Data Fetching Patterns

**What it checks:**
- Using fetch API with Next.js caching
- Proper revalidation strategies
- Error handling in data fetching
- Loading states and Suspense
- Avoiding redundant fetches
- Environment variables usage

**Example feedback:**
```
❌ Problem: No caching strategy specified
✅ Solution: Configure cache and revalidation:
   // ISR with 1 hour revalidation
   export const revalidate = 3600

   // Or use fetch with cache option:
   fetch(url, { next: { revalidate: 3600 } })
```

### 4. Performance Optimization

**What it checks:**
- Image optimization with next/image
- Font loading and optimization
- Script optimization with next/script
- CSS and module organization
- Bundle size awareness
- Lazy loading and code splitting
- Unnecessary re-renders

**Example feedback:**
```
❌ Problem: Using <img> tags instead of Image
✅ Solution: Use Next.js Image component for optimization:
   import Image from 'next/image'

   <Image
     src="/image.jpg"
     alt="description"
     width={800}
     height={600}
   />
```

### 5. API Routes/Route Handlers

**What it checks:**
- Proper HTTP method handling
- Error handling and status codes
- Middleware usage
- Request validation
- Response formatting
- Security headers
- Authentication/authorization

**Example feedback:**
```
❌ Problem: No error handling in route handler
✅ Solution: Add proper error handling:
   export async function GET(request) {
     try {
       const data = await fetchData()
       return Response.json(data)
     } catch (error) {
       return Response.json(
         { error: error.message },
         { status: 500 }
       )
     }
   }
```

### 6. Metadata and SEO

**What it checks:**
- Proper metadata configuration
- Dynamic metadata generation
- Open Graph and social sharing
- Canonical URLs
- Structured data (JSON-LD)
- Robot and sitemap configuration

**Example feedback:**
```
❌ Problem: No metadata exported
✅ Solution: Configure metadata in layout:
   export const metadata = {
     title: 'Page Title',
     description: 'Page description for SEO',
     openGraph: {
       title: 'OG Title',
       description: 'OG Description',
       images: ['/og-image.jpg']
     }
   }
```

### 7. Middleware and Guards

**What it checks:**
- Middleware.js configuration
- Auth guards and redirects
- Request/response manipulation
- Cookie and header handling
- Proper error responses

**Example feedback:**
```
❌ Problem: Auth logic scattered across routes
✅ Solution: Use middleware for centralized auth:
   export function middleware(request) {
     if (!request.cookies.has('auth')) {
       return NextResponse.redirect(new URL('/login', request.url))
     }
   }

   export const config = {
     matcher: ['/dashboard/:path*']
   }
```

### 8. Environment and Configuration

**What it checks:**
- Environment variable usage (.env.local, etc.)
- Runtime vs build-time variables
- Secrets management
- Configuration patterns
- Development vs production settings

**Example feedback:**
```
❌ Problem: Sensitive data in NEXT_PUBLIC_ variables
✅ Solution: Use proper environment variable prefixes:
   // Public (accessible in browser):
   NEXT_PUBLIC_API_URL=http://localhost:3000

   // Private (server-only):
   DATABASE_URL=postgresql://...
   API_SECRET=secret-key
```

## Development Workflow Integration

### Phase 1: Implementation (TDD Red/Green)
After writing tests and implementing components:
```
1. Component is functionally complete
2. Tests are passing
3. → Run Next.js Expert review
4. Apply recommendations
5. Verify tests still pass
```

### Phase 2: Optimization (Refactoring)
During refactoring phase:
```
1. Code works correctly
2. Tests verify behavior
3. → Run Next.js Expert review
4. Optimize and improve
5. Maintain test coverage
```

### Phase 3: Before Deployment
Before shipping to production:
```
1. Features complete
2. Tests passing
3. → Run Next.js Expert review
4. Address performance and security
5. Final verification
```

## Best Practices Reviewed

### ✅ Server Components by Default
- Use Server Components for data fetching
- Only use 'use client' when necessary
- Leverage async/await in Server Components

### ✅ Efficient Data Fetching
- Fetch at component level or higher
- Use proper caching strategies
- Avoid N+1 queries
- Consider data dependencies

### ✅ Optimized Images and Assets
- Use next/image for all images
- Use next/font for web fonts
- Lazy load non-critical content
- Optimize media files

### ✅ Type Safety
- Use TypeScript for components
- Type props and state properly
- Type API responses
- Use discriminated unions for state

### ✅ Error Handling
- Implement error.js boundaries
- Handle loading states with Suspense
- Provide meaningful error messages
- Log errors appropriately

### ✅ Accessibility
- Semantic HTML (use proper tags)
- ARIA labels where needed
- Keyboard navigation support
- Color contrast requirements
- Form validation feedback

## Example: Component Review

### Original Code
```javascript
// app/products/page.js
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>
          <img src={product.image} alt={product.name} width={200} height={200} />
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Expert Feedback & Improvements

**Issues Found:**
1. ❌ Page is 'use client' but only fetching data
2. ❌ Using `<img>` instead of `<Image>`
3. ❌ Fetching in useEffect on client
4. ❌ No metadata export
5. ❌ No error handling
6. ❌ No caching strategy

**Improved Code:**
```javascript
// app/products/page.js
import { Suspense } from 'react'
import Image from 'next/image'
import { ProductList } from '@/components/ProductList'
import { ProductSkeleton } from '@/components/ProductSkeleton'

export const metadata = {
  title: 'Products',
  description: 'Browse our product catalog'
}

async function getProducts() {
  try {
    const res = await fetch('http://localhost:3000/api/products', {
      next: { revalidate: 3600 } // ISR: revalidate hourly
    })

    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  } catch (error) {
    console.error('Products fetch error:', error)
    throw error
  }
}

export default async function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList />
      </Suspense>
    </div>
  )
}

// app/products/ProductList.js
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export async function ProductList() {
  const products = await getProducts()

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            className="rounded"
          />
          <h2 className="font-semibold">{product.name}</h2>
          <p className="text-lg font-bold">${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

**Improvements Made:**
- ✅ Page is Server Component (fetches data)
- ✅ Uses `<Image>` for optimization
- ✅ Data fetching at server level
- ✅ Metadata exported for SEO
- ✅ Error handling implemented
- ✅ Caching/revalidation configured
- ✅ Suspense for loading state

## Recommendations Template

When reviewing code, the agent provides:

1. **Overview** - What was reviewed
2. **Issues Found** - Categorized by severity
3. **Recommendations** - With code examples
4. **Best Practices** - Applied patterns
5. **Performance Impact** - Expected improvements
6. **Next Steps** - Action items

## Integration with Other Agents

- **Test Quality Reviewer** - Ensures tests cover refactored components
- **Code Analyzer** - General code quality and style
- **System Architect** - Large-scale architectural decisions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [React Documentation](https://react.dev)
- [Web Vitals & Performance](https://web.dev/vitals/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Pro Tips

1. **Run early and often** - Get feedback during development, not after
2. **Combine with tests** - Use alongside TDD for confidence
3. **Learn patterns** - Each review teaches Next.js best practices
4. **Share findings** - Help team learn from recommendations
5. **Iterate quickly** - Apply feedback and improve continuously
