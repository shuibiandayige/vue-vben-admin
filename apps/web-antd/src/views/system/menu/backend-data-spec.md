# Menu Backend Data Requirements (Web Antd)

This document captures the backend data node requirements and data structure expectations used by the Menu page.

Sources:
- apps/web-antd/src/api/system/menu.ts
- apps/web-antd/src/views/system/menu/list.vue
- apps/web-antd/src/views/system/menu/modules/form.vue
- apps/backend-mock/api/system/menu/*.ts
- apps/backend-mock/utils/mock-data.ts (MOCK_MENU_LIST)

## API Endpoints

### GET /system/menu/list
- Purpose: fetch menu list for the tree table and tree select.
- Response: array of menu nodes (tree). Each node may include `children`.
- Notes:
  - UI tree table expects a tree structure (children field) and uses `id`/`pid` fields.
  - Tree select uses `children` with `labelField = meta.title` and `valueField = id`.

### GET /system/menu/name-exists
- Query params:
  - `name` (string, required)
  - `id` (string | number, optional) for edit exclusion
- Response: boolean
- Purpose: validate that `name` is unique (excluding current id when editing).

### GET /system/menu/path-exists
- Query params:
  - `path` (string, required)
  - `id` (string | number, optional) for edit exclusion
- Response: boolean
- Purpose: validate that `path` is unique (excluding current id when editing).

### POST /system/menu
- Body: menu payload (see "Create/Update payload")
- Purpose: create a new menu node.

### PUT /system/menu/{id}
- Body: menu payload (see "Create/Update payload")
- Purpose: update a menu node.

### DELETE /system/menu/{id}
- Purpose: delete a menu node.

## Menu Node Structure

### Core fields
- `id` (string | number): unique identifier.
- `pid` (string | number, optional): parent id; root nodes may omit.
- `name` (string): backend permission identifier / unique name.
- `type` (enum): `catalog` | `menu` | `embedded` | `link` | `button`.
- `path` (string, optional by type): route path, usually starts with `/`.
- `component` (string, optional by type): route component path for `menu` type.
- `authCode` (string, optional by type): backend permission code.
- `status` (number): 1 (enabled) or 0 (disabled).
- `redirect` (string, optional): route redirect.
- `children` (array, optional): child menu nodes.
- `meta` (object, optional): menu metadata.

### Meta fields
- `title` (string, required): i18n key or display title used in UI.
- `icon` (string, optional): menu icon (Iconify name).
- `activeIcon` (string, optional): active icon.
- `activePath` (string, optional): route path to highlight as active.
- `affixTab` (boolean, optional)
- `affixTabOrder` (number, optional)
- `badgeType` (enum, optional): `dot` | `normal`.
- `badge` (string, optional): badge text, only for `badgeType = normal`.
- `badgeVariants` (enum, optional): `default` | `destructive` | `primary` | `success` | `warning`.
- `hideChildrenInMenu` (boolean, optional)
- `hideInBreadcrumb` (boolean, optional)
- `hideInMenu` (boolean, optional)
- `hideInTab` (boolean, optional)
- `iframeSrc` (string, optional): iframe URL for `embedded` type.
- `keepAlive` (boolean, optional)
- `link` (string, optional): URL for `link` type.
- `maxNumOfOpenTab` (number, optional)
- `noBasicLayout` (boolean, optional)
- `openInNewWindow` (boolean, optional)
- `order` (number, optional): menu order.
- `query` (object, optional): extra route params.

### Additional fields
- The UI type definition allows extra fields via `[key: string]: any`.
- Mock data includes a top-level `icon` on some nodes; prefer `meta.icon` for UI.

## Create/Update Payload

When creating or updating, the UI submits the node without `id` and `children`.

Payload shape (simplified):

```
{
  pid?: string | number,
  name: string,
  type: "catalog" | "menu" | "embedded" | "link" | "button",
  path?: string,
  component?: string,
  authCode?: string,
  status: 0 | 1,
  redirect?: string,
  meta?: {
    title: string,
    icon?: string,
    activeIcon?: string,
    activePath?: string,
    affixTab?: boolean,
    affixTabOrder?: number,
    badgeType?: "dot" | "normal",
    badge?: string,
    badgeVariants?: "default" | "destructive" | "primary" | "success" | "warning",
    hideChildrenInMenu?: boolean,
    hideInBreadcrumb?: boolean,
    hideInMenu?: boolean,
    hideInTab?: boolean,
    iframeSrc?: string,
    keepAlive?: boolean,
    link?: string,
    maxNumOfOpenTab?: number,
    noBasicLayout?: boolean,
    openInNewWindow?: boolean,
    order?: number,
    query?: object
  }
}
```

## UI Validation Rules by Type

- Common
  - `name`: length 2-30; must be unique (`/system/menu/name-exists`).
  - `meta.title`: required.
  - `status`: required (1 or 0).

- `catalog`
  - `path`: required, length 2-100, must start with `/`, must be unique (`/system/menu/path-exists`).
  - `meta.icon` and `meta.activeIcon`: optional.
  - `authCode`: optional.

- `menu`
  - `path`: required, length 2-100, must start with `/`, must be unique.
  - `component`: required (picked from `componentKeys`).
  - `meta.icon` and `meta.activeIcon`: optional.
  - `meta.keepAlive`: optional.
  - `meta.affixTab`: optional.
  - `authCode`: optional.

- `embedded`
  - `path`: required, length 2-100, must start with `/`, must be unique.
  - `linkSrc`: required, URL; saved into `meta.iframeSrc`.
  - `meta.icon` and `meta.activeIcon`: optional.
  - `meta.affixTab`: optional.
  - `authCode`: optional.

- `link`
  - `linkSrc`: required, URL; saved into `meta.link`.
  - `path`: UI hides this field, but if provided it should start with `/` and be unique.
  - `meta.icon`: optional.

- `button`
  - `authCode`: required.
  - `path`, `component`, `meta.icon`, `meta.activeIcon`, `linkSrc`: not used.

- `activePath` (for `menu` and `embedded` only)
  - Optional, must start with `/` and must already exist in menu paths.

## Notes and Expectations

- Tree structure: backend should return `children` arrays; `pid` is still used to create and append nodes.
- For `link` and `embedded`, the UI maps a transient field `linkSrc` to `meta.link` or `meta.iframeSrc` before submit.
- Table display:
  - Title uses `meta.title` and i18n.
  - Badge uses `meta.badgeType`, `meta.badge`, `meta.badgeVariants`.
  - Component column shows `component` for `menu`/`catalog`, `meta.iframeSrc` for `embedded`, `meta.link` for `link`.

