# ASUS ExpertBook Ultra Frame Generator

A high-performance, client-side web application built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. It allows users to upload a personal photo, position, zoom, and rotate it behind the official **ASUS ExpertBook Ultra** promotional frame artwork, and download a pixel-perfect $1024 \times 1024\text{ px}$ composition in PNG or JPEG format.

---

## 1. Project Overview

The **ASUS ExpertBook Ultra Frame Generator** is designed with a premium, dark aesthetic inspired by ASUS global product launch branding. It features:
- **Zero Server Uploads (100% Privacy)**: All image rendering, transformation, and compositing occur directly within browser memory using HTML5 Canvas 2D APIs.
- **Exact Native Resolution**: Previews responsively across mobile, tablet, and desktop viewports, but always generates an uncompromised $1024 \times 1024\text{ px}$ master file upon download.
- **Direct Canvas Manipulation**: Click/drag to pan, mouse scroll to zoom, single-touch dragging, and two-finger pinch-to-zoom on touch devices.
- **Precision Slider Controls**: Granular controls for Zoom ($0.3\times - 3.5\times$), Horizontal Pan ($\pm 700\text{px}$), Vertical Pan ($\pm 700\text{px}$), and Rotation ($-180^\circ$ to $+180^\circ$) with dedicated reset buttons.
- **Multi-Format Export**: One-click download as lossless **PNG** or compressed **JPEG** with custom quality settings (default 95%).

---

## 2. Local Development Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18.18+ or v20+
- npm, yarn, or pnpm

### Setup Steps
1. Clone or navigate to the project directory:
   ```bash
   cd Frame
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. Build and validate for production:
   ```bash
   npm run build
   npm run lint
   ```

---

## 3. How to Replace `Frame.png`

The official frame artwork is located at:
```
public/Frame.png
```

To update or replace the frame:
1. Ensure your replacement image is a transparent PNG of exactly **$1024 \times 1024\text{ px}$**.
2. Save the file with the exact name `Frame.png` inside the `public/` directory:
   ```
   public/Frame.png
   ```
3. If the central aperture geometry differs from the default circle, you can update the geometry constants in:
   [`src/lib/constants.ts`](src/lib/constants.ts):
   ```typescript
   export const FRAME_GEOMETRY = {
     canvasWidth: 1024,
     canvasHeight: 1024,
     centerX: 506, // Center X coordinate of the aperture
     centerY: 445, // Center Y coordinate of the aperture
     radius: 351,  // Radius of circular mask
     diameter: 702,// Diameter for cover fitting
   };
   ```

---

## 4. How Canvas Compositing Works

The compositing engine lives in [`src/lib/canvasRenderer.ts`](src/lib/canvasRenderer.ts) and executes the following deterministic rendering pipeline:

```
+-------------------------------------------------------------+
|                     1024 x 1024 Canvas                      |
|                                                             |
|  1. ctx.clearRect(0, 0, 1024, 1024)                         |
|                                                             |
|  2. BASE LAYER (User Photo):                                |
|     - ctx.save()                                            |
|     - ctx.arc(506, 445, 351, 0, 2*PI)                       |
|     - ctx.clip()                                            |
|     - ctx.translate(centerX + panX, centerY + panY)         |
|     - ctx.rotate(rotation)                                  |
|     - ctx.scale(baseCoverScale * zoom, ...)                 |
|     - ctx.drawImage(userImage, -w/2, -h/2, w, h)            |
|     - ctx.restore()                                         |
|                                                             |
|  3. TOP LAYER (ASUS Frame):                                 |
|     - ctx.drawImage(frameImage, 0, 0, 1024, 1024)           |
|     - Foreground laptop artwork & typography stay on top    |
+-------------------------------------------------------------+
```

### Key Mathematical & Geometric Guarantees:
1. **Circular Aperture Bounds**: The transparent hole spans $x \in [152, 860]$ and $y \in [99, 786]$ with center $(506, 445)$ and radius $351\text{ px}$.
2. **Strict Clipping**: Clipping prevents the user's photo from ever bleeding into outer borders, top logos, or surrounding architectural artwork.
3. **Foreground Protection**: Because `Frame.png` is rendered on top at $(0, 0)$ with native $1024 \times 1024$ dimensions, the opaque laptop artwork at the bottom of the circle covers the lower portion of the user photo with $100\%$ pixel-perfect fidelity.

---

## 5. How to Deploy to Vercel

The application is completely self-contained with zero server dependencies and zero environment variables required.

### Method A: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Run deployment from project root:
   ```bash
   vercel
   ```
3. Follow prompts to link and deploy. For production:
   ```bash
   vercel --prod
   ```

### Method B: Deploy via Vercel Web Dashboard
1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New..."** -> **"Project"**.
4. Import your repository.
5. Keep default build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Click **Deploy**.

---

## 6. How to Connect the GitHub Repository to Vercel

1. **Initialize Git & Commit**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial ASUS ExpertBook Ultra Frame Generator release"
   ```

2. **Create a New Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g. `asus-frame-generator`).
   - Keep it Public or Private.

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/asus-frame-generator.git
   git push -u origin main
   ```

4. **Connect GitHub to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New...** -> **Project**.
   - Select your GitHub provider and search for `asus-frame-generator`.
   - Click **Import** and **Deploy**.
   - Every push to `main` will automatically trigger a preview and production deployment.

---

## 7. Assumptions & Technical Notes

1. **Frame Asset**: `Frame.png` is an authentic $1254 \times 1254\text{ px}$ RGBA image. It is placed in `public/Frame.png` and never modified or distorted.
2. **Clipping Region**: Programmatic analysis of alpha transparency identified the central circle center at $(618.5, 568.5)$ with radius $507\text{ px}$.
3. **Laptop Overlay**: The ASUS laptop artwork occupies the bottom area ($y > 800$) inside the circular boundary. Rendering `Frame.png` as the top layer ensures the laptop artwork and ASUS typography remain in front of the user photo.
