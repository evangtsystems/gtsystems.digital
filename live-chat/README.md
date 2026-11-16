# GTSystems live chat

Standalone chat inbox for GTSystems. This project is separate from the website and dashboard. The chat inbox uses the dashboard's existing active user accounts through its internal login and session endpoints; it does not read or copy passwords. Conversation history is stored in a dedicated SQLite database.

This folder is maintained in the website repository, but remains an independent Node.js service with its own dependencies. On the VPS, the existing service runs from `/opt/gtsystems-live-chat` and uses `/etc/gtsystems-live-chat.env`; pulling the website repository alone does not update or restart the chat service. When deploying chat changes, update the service files separately, preserve its environment and persistent database, install production dependencies, and restart `gtsystems-live-chat`.

Configuration is via environment variables: `PORT`, `NODE_ENV`, `CHAT_PANEL_ORIGIN`, `CHAT_ALLOWED_ORIGINS`, `CHAT_DATA_DIR`, `DASHBOARD_AUTH_ORIGIN`, and `TURNSTILE_SECRET_KEY`. Keep the database outside release directories and include it in backups. Production requires HTTPS and Cloudflare Turnstile. Both the website origins and the panel origin must be explicitly listed in `CHAT_ALLOWED_ORIGINS`. Protect the dashboard auth origin so it cannot be reached by untrusted clients directly. The default auth origin is the dashboard on the same host, port 7001. In production, `CHAT_USER_DB_HOST`, `CHAT_USER_DB_PORT`, `CHAT_USER_DB_NAME`, `CHAT_USER_DB_USER` and `CHAT_USER_DB_PASSWORD` must be configured with read-only SELECT access to the dashboard users table. Every request rechecks the account is active; without database configuration production sign-in fails closed.

Run `npm install` and `npm start`. The server binds to localhost. The dashboard authentication dependency must be running for staff sign-in. Do not enable public access without configuring real Turnstile credentials, HTTPS, origin restrictions, persistence, and the reverse proxy.


## Existing-customer verification

Visitors can choose whether they are existing customers. An existing customer can enter a nine-digit VAT number and receives a six-digit, ten-minute, single-use code at the email address already registered on their unmerged customer record. The system does not reveal whether a VAT number exists or expose its registered address. Only successful confirmation marks the conversation as verified for staff. The service never logs or stores the VAT number or plaintext verification code.

Production requires a high-entropy `CHAT_VERIFICATION_SECRET`, `BREVO_API_KEY`, and a verified `BREVO_SENDER_EMAIL`. The same restricted dashboard database user also needs column-level `SELECT` for `id`, `vat`, `email`, `company_name`, and `merged_into` on `clients`. Limit access to those columns; never copy database credentials into the repository. Keep both services private until the email sender, the domain allowed by Turnstile, database permissions, backups, and authentication are verified. Failed code attempts are limited, as are verification requests per IP and per VAT number. The OTP is scoped to the visitor's current conversation.

The customer lookup accepts exactly one non-merged record with a single valid stored email. Missing, invalid, or duplicate records receive the same generic response and must be handled by staff through another channel. This confirms control of the registered mailbox, rather than identity with absolute certainty. Test only with mock data or an explicitly authorised test mailbox.
