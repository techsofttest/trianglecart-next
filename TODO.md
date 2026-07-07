# trianglecart - Customer Dashboard Refactor TODO

## Completed
- [x] Locate existing dashboard implementation (query param tabs) in Next.js.
- [x] Confirm current dummy sidebar/header + dummy data sources.

## Next steps
- [x] Refactor routes: change `/profile?tab=orders` style to path routes `/profile/orders`, `/profile/addresses`, etc.
- [x] Update `app/profile/page.tsx` to become Dashboard Home (default `/profile`).
- [ ] Update sidebar navigation to use new paths and highlight active segment.
- [ ] Make sidebar header (name + email) dynamic (connect to backend/local auth source used by this project).
- [ ] Add Laravel API endpoints for dashboard summary + profile info.
- [ ] Replace dummy OrderHistory / AddressBook / WishlistView with API-backed implementations.
- [ ] Implement Dashboard Home summary widgets using API data.

## Notes
- Current frontend folder: `c:/laragon/www/trianglecart-front`
- Backend folder: `c:/laragon/www/trianglecart`

