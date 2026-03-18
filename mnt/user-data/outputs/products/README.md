# Products — DHCW Single Record Design System

This folder contains product-specific extensions, overrides, and context for each product within the Single Record programme.

## Structure

```
/products
├── README.md           ← this file
├── product-a/          ← rename once product name is confirmed
│   └── README.md
└── product-b/          ← rename once product name is confirmed
    └── README.md
```

## How Products Relate to Core

Products **extend** the core design system — they do not fork it.

| Layer | Location | Ownership |
|---|---|---|
| Core tokens | `/foundations/` | Design system team |
| Core components | `/components/` | Design system team |
| Core patterns | `/patterns/` | Design system team |
| Product overrides | `/products/[name]/` | Product team + design system team |

A product override is only justified when a component or pattern genuinely must behave differently in that product's context. If a change benefits all products, it belongs in core.

## Renaming Products

When product names are confirmed, rename the folders:
- `product-a/` → `[actual-product-name]/`
- `product-b/` → `[actual-product-name]/`

Update references in `PROJECT_MEMORY.md` and add a DDR if the product scope affects design decisions.
