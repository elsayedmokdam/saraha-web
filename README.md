# Saraha Web

Next.js 16 (App Router) front-end for the **Saraha API** (anonymous messages, identity requests and conversations).
Built with the same conventions as your previous front-end: services layer + server actions, `$SERVICE_REPOSITORY`,
`$SCHEMAS_REPOSITORY` (zod), config-driven `AppForm`, Redux preloaded from the root layout, NextAuth, `proxy.ts`, shadcn/ui.

## Run

```bash
npm install
cp .env.example .env.development      # then fill NEXTAUTH_SECRET (openssl rand -base64 32)
npm run dev                           # http://localhost:3001  (the API uses :3000)
```

For production use `.env.production` (same keys) and `npm run build && npm start`.

## Endpoint coverage (all 26 routes of the API)

| API endpoint | Service | Used in |
|---|---|---|
| `ALL /` | `system/ping` | Footer API status |
| `POST /auth/signup` | `auth/signup` | `/signup` |
| `POST /auth/signup-with-gmail` | `auth/signupWithGmail` | Google button (NextAuth `signIn` callback) |
| `POST /auth/login` | `auth/login` | `/signin` (NextAuth credentials) |
| `POST /auth/2fa/login` | `auth/twoFALogin` | `/signin` "Two-step verification" step 1 |
| `POST /auth/2fa/verify-otp` | `auth/verify2FALogin` | `/signin` step 2 (NextAuth credentials, `mode: "2fa"`) |
| `POST /auth/resend-confirm-email-otp` | `auth/resendConfirmEmailOTP` | `/confirm-email` |
| `PATCH /auth/confirm-email` | `auth/confirmEmail` | `/confirm-email` |
| `POST /auth/forgot-password` | `auth/forgotPassword` | `/forgot-password` step 1 |
| `POST /auth/verify-reset-password-otp` | `auth/verifyResetPasswordOTP` | `/forgot-password` step 2 |
| `PATCH /auth/reset-password` | `auth/resetPassword` | `/forgot-password` step 3 |
| `POST /auth/logout` | `auth/logout` | Navbar menu + `/profile` (this device / all devices) |
| `GET /user/profile` | `users/getProfile` | root layout, `/profile` |
| `PUT /user/update-data` | `users/updateUserData` | `/settings` > Profile |
| `PATCH /user/update-password` | `users/updatePassword` | `/settings` > Password |
| `PATCH /user/profile-image` | `users/uploadProfileImage` | `/profile` |
| `GET /user/all` (admin) | `users/getAllUsers` | `/admin/users` |
| `POST /user/rotate-token` | `users/rotateToken` | NextAuth `jwt` callback + `/profile` "Refresh now" |
| `POST /message` | `messages/createMessage` | `/messages/new`, `/u/[id]` |
| `GET /message` | `messages/getMessages` | `/messages` (tabs, search, pagination) |
| `DELETE /message/:messageId` | `messages/deleteMessage` | `/messages` |
| `POST /message/:messageId/identity-request` | `identityRequests/createIdentityRequest` | `/messages` ("Who sent this?") |
| `GET /message/identity-request` | `identityRequests/getIdentityRequests` | `/identity-requests`, navbar badge |
| `PATCH /message/:requestId/identity-request` | `identityRequests/respondToIdentityRequest` | `/identity-requests` |
| `GET /conversation/user` | `conversations/getUserConversations` | `/conversations` (list of my chats) |
| `POST /conversation/:id/messages` | `conversations/createConversationMessage` | `/conversations/[id]` |
| `GET /conversation/:id/messages` | `conversations/getConversationMessages` | `/conversations/[id]` |
| `GET /assets/**` (static) | `assetUrl()` + `/media` rewrite | avatars and attachments |

## Look & feel

* Chat-app shell: icon rail on desktop, top bar + bottom tabs on mobile (`components/app-shell`), two-pane **Chats** (list + conversation), bubble-style **Inbox**.
* **Light / Dark / System** theme (`next-themes`): toggle in the rail / top bar and the *Settings > Appearance* tab. Colors are semantic tokens in `globals.css` (`bg-card`, `text-muted-foreground`, `bg-bubble-in` ...), so every component follows the theme; change the whole palette in one place (`:root` and `.dark`). Brand color: `--color-main-color`.

## Things the API forces the front-end to handle

* **`Accept-Language` must be `0` or `1`.** Node's `fetch` sends `*` and browsers send `en-US,...`; the API rejects both with 400. The HTTP client always sends `0`.
* **API requests forward the caller IP in `X-Forwarded-For`.** The shared HTTP client reads the first address from the incoming `X-Forwarded-For` header, or `X-Real-IP` if that is the only address supplied by the hosting proxy. A hosting proxy must provide one of these headers for the caller IP to be forwarded.
* **`/user/rotate-token` issues tokens without a `sub` claim** (`createLoginCredentials({ payload: user })` should be `{ sub: user._id, role: user.role }`), so rotated tokens are rejected. The front-end detects this and signs the user out cleanly instead of keeping a broken session. After you fix the API it rotates silently.
* **Password hashes are returned by `/user/profile`, `/user/all`, confirm-email, etc.** They are stripped on the server (`sanitizeUser`) and never reach the browser.
* `GET /conversation/user` ignores `page` / `limit` and does not sort (the controller does not pass `req.query` to `find()`), so it returns at most 10 conversations. The list sorts client-side and "Load more" starts working as soon as the API forwards the query.
* `meta.totalPages` of `GET /message/identity-request` counts the whole collection, so "Load more" stops when a page is shorter than `limit`.
* Uploads are served with `Cross-Origin-Resource-Policy: same-origin`; they are proxied through `/media/**` (`next.config.ts`).
* `PUT /user/update-data` stores `phone` as plain text while signup encrypts it, and `GET /message/identity-request` decrypts it: a user who edits their data can break that endpoint. The API also never returns the phone, so the form asks for it again. `role` is accepted by this endpoint too (privilege escalation): the UI never sends it.
* `PATCH /user/update-password` does not end other sessions; the form offers "Log me out of all devices".
* The API rate limiter allows only Egyptian IPs (limit 0 otherwise): on `localhost` every call can answer **429**.

## Google sign-in (optional)

Set `GOOGLE_CLIENT_ID/SECRET`. The same client id must be in the API's `WEB_CLIENT_IDs` (it verifies the ID token).
Redirect URI: `http://localhost:3001/api/auth/callback/google`.
