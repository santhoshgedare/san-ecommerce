# San E-Commerce Admin

Angular 22 standalone admin application for the `san-ecommerce` platform.

## Highlights

- Standalone components and lazy-loaded routes
- Strict TypeScript, ESLint, Prettier, SCSS
- Angular Signals for UI state and RxJS for API communication
- JWT authentication shell with refresh token, remember me, auto-login, and idle timeout
- Role/permission-aware navigation, guards, directive, and layout
- Responsive Angular Material dashboard with Chart.js, theme toggle, and i18n wiring
- Typed integration services aligned to the existing `.NET 10` JWT API endpoints

## Location

Frontend source lives in `/home/runner/work/san-ecommerce/san-ecommerce/src/san-ecommerce-app.Web`.

## Commands

```bash
npm install
npm run lint
npm run build
npm start
```

## Structure

- `src/app/core` - auth, authorization, guards, interceptors, configuration, typed models
- `src/app/shared` - reusable Material-backed UI components, directive, pipe, validators, services
- `src/app/layouts` - admin shell and auth shell
- `src/app/features` - dashboard, auth, users, roles, permissions, profile, settings
- `src/environments` - environment-based API configuration
- `src/assets/i18n` - translation catalogs

## API alignment

Configured endpoints match the current backend controllers:

- `POST /api/v1/Auth/login`
- `POST /api/v1/Auth/refresh-token`
- `POST /api/v1/Auth/change-password`
- `POST /api/v1/Auth/forgot-password`
- `POST /api/v1/Auth/reset-password`
- `POST /api/v1/Auth/revoke-token`
- `GET/POST/PUT/DELETE /api/v1/Users`
- `POST/DELETE /api/v1/Users/{id}/roles/{roleName}`
- `GET/POST/DELETE /api/v1/Roles`

The current backend does not yet expose dedicated permission-management or role-update endpoints, so those areas are implemented as production-ready UI shells with typed services ready for API expansion.

## Notes

- `environment.ts` defaults to `https://localhost:7069/api/v1`; adjust for your deployment pipeline.
- Translation catalogs currently include English and Spanish starter content.
- Excel export uses an Excel-compatible tab-delimited download to avoid adding vulnerable spreadsheet dependencies.
