# InfronixWeb Digital Marketing

Welcome to the official repository for **InfronixWeb**, a premium digital web agency. We specialize in crafting state-of-the-art, high-performance web applications with a focus on modern aesthetics, security, and scalability.

## Our Expertise

At InfronixWeb, we don't just build websites; we engineer digital experiences. Our core capabilities include:

- **Custom Web Development:** Building scalable, secure, and lightning-fast web applications tailored to our clients' needs.
- **UI/UX Design:** Delivering premium, modern aesthetics with consistent typography, smooth micro-animations, and mobile-first responsive layouts.
- **Frontend/Backend Separation:** Ensuring clean architecture, maintainability, and seamless API integrations through dedicated service layers.
- **Performance & SEO:** Optimizing Core Web Vitals, implementing lazy-loading, semantic HTML, and comprehensive on-page SEO strategies to ensure maximum visibility and speed.
- **Security-First Approach:** Validating all user inputs, protecting API endpoints, and keeping secrets strictly in environment variables.

## Technology Stack

This project is built using modern web technologies to ensure a robust and flexible foundation:

- **Framework:** React / Modern Web Platform (Functional components & modern hooks)
- **Styling:** Vanilla CSS & PostCSS (Custom design system, avoiding generic UI kits)
- **Architecture:** Clean component structures, separated business logic, and dedicated API handling.

## Development Setup

To run the InfronixWeb platform locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/madhavdavda2009-rgb/infronix.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - *Note: Never commit `.env` files to the repository.*

4. Start the development server:
   ```bash
   npm run dev
   ```

## Team and blog image storage

Team profiles and articles use the image saved in the admin CMS. Local files do
not override an uploaded photo. Until Cloudinary is configured, uploads remain
in the database and are served through the versioned public media endpoint.

To enable Cloudinary, create a product environment, open Console Settings → API
Keys, and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` in the local server environment and the hosting provider's
server environment. Restart or redeploy after changing these values. Keep the
secret on the server; never use a `NEXT_PUBLIC_` name or paste it into a blog form.
No unsigned upload preset is needed. Authenticated admin uploads are signed on
the server and use a new asset ID for each image, preventing overwrite and cache
collisions. Save the profile or article after the upload finishes.

Existing database images continue to work when Cloudinary is enabled. New uploads
use Cloudinary; migrating old images requires a configured account first.

## Project Principles

- **Architecture:** Strict frontend/backend separation with no duplicate code.
- **Design:** No placeholder components. Every element must feel premium, alive, and interactive.
- **Security:** Zero trust model. All data is validated, sanitized, and authenticated.
