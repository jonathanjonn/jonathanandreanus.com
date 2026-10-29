---
role: Technical Co-Founder
organization: Bukankelas
url: https://bukankelas.com
location: Remote
start: 2024-09
---

- Converted 18 of 50 soft-launch webinar attendees (36%) into paying students by building the webinar lead funnel: email nurture in Resend and n8n, then Midtrans checkout on the platform.
- Serve 100+ paying students with 0 payment mismatches since launch, on a platform built and run as the sole engineer: Next.js 14, TypeScript, Prisma/MySQL, Redis, Clerk and Midtrans (QRIS), deployed on a VPS (PM2, nginx) with separate staging and production.
- Closed 7 production security vulnerabilities test-first, and made Midtrans payment callbacks fail closed on forged, duplicate or wrong-amount notifications (timing-safe signature, duplicate and amount checks), backed by atomic paid-state updates and a reconciliation cron.
- Held promo codes to 0 oversells in concurrency and load tests (1,000 simulated buyers racing for 1 slot: exactly 1 winner, 0 errors; 600 virtual users on staging) by reserving each slot inside a Serializable database transaction.
