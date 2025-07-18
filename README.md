# Shivam Yadav - Portfolio Website

A modern, responsive portfolio website showcasing my journey as a Full-Stack Developer and MCA Graduate. Built with cutting-edge technologies and optimized for performance.

## 🚀 Live Demo

Visit my portfolio at: [Portfolio](https://tecportfolio.netlify.app/)

## ⚡ Performance Optimizations

This portfolio has been optimized for maximum performance and user experience:

### **Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1

### **Performance Features**
- ✅ **Next.js 14.2.30** - Latest stable version with security patches
- ✅ **Image Optimization** - WebP/AVIF formats with responsive sizing
- ✅ **Font Optimization** - Optimized Google Fonts with font-display: swap
- ✅ **Code Splitting** - Automatic component-based code splitting
- ✅ **Lazy Loading** - Images and components load when needed
- ✅ **Compression** - Gzip/Brotli compression enabled
- ✅ **Bundle Analysis** - Built-in bundle analyzer support
- ✅ **Performance Monitoring** - Real-time Web Vitals tracking (dev mode)

### **Technical Optimizations**
- 🚀 **Animation Performance**: GPU-accelerated animations with `will-change`
- 🚀 **Memory Efficiency**: Memoized components and optimized re-renders
- 🚀 **Loading States**: Comprehensive loading UI with skeleton screens
- 🚀 **Error Boundaries**: Robust error handling with graceful fallbacks
- 🚀 **SEO Optimized**: Complete meta tags, Open Graph, and Twitter Cards
- 🚀 **Accessibility**: WCAG 2.1 AA compliant with proper focus management

### **Build Optimizations**
- Tree shaking for unused code elimination
- Minification and compression
- Source map optimization for production
- CSS optimization and purging
- Modern browser targeting with SWC compiler

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.30 (App Router) - Latest stable with security patches
- **Language**: TypeScript - Type-safe development
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **UI Components**: Radix UI + Custom Components - Accessible and customizable
- **Animations**: Framer Motion - High-performance animations
- **Icons**: Lucide React - Beautiful & consistent icons
- **Content**: MDX for blog posts - Markdown with JSX components
- **Performance**: Built-in monitoring and optimization
- **Deployment**: Vercel (recommended) - Optimized for Next.js

### **Additional Features**
- 🎨 **Theme System**: Dark/Light mode with system preference detection
- 📱 **Responsive Design**: Mobile-first approach with fluid layouts
- 🔧 **Type Safety**: Full TypeScript coverage for better DX
- 📊 **Analytics Ready**: Performance monitoring and Web Vitals tracking
- 🛡️ **Security**: Content Security Policy and security headers
- ♿ **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sy17258/portfolio
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   
   # Using pnpm (recommended)
   pnpm install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using yarn
   yarn dev
   
   # Using pnpm
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Personal Information

Edit the main configuration file at `src/data/resume.ts` to customize:

- Personal details (name, bio, location)
- Work experience
- Education
- Skills
- Projects
- Contact information
- Social media links

### Blog Posts

Add new blog posts by creating `.mdx` files in the `content/` directory. Each post should have frontmatter with:

```yaml
---
title: "Your Blog Post Title"
publishedAt: "2025-01-15"
summary: "Brief description of your post"
---
```

### Styling

- **Colors**: Modify the color scheme in `src/app/globals.css`
- **Components**: Customize UI components in `src/components/ui/`
- **Layout**: Adjust layout in `src/app/layout.tsx`

## 📁 Project Structure

```
portfolio/
├── content/                 # Blog posts (MDX)
├── public/                  # Static assets
├── src/
│   ├── app/                # Next.js app router pages
│   ├── components/         # React components
│   │   ├── magicui/       # Custom animation components
│   │   └── ui/            # Reusable UI components
│   ├── data/              # Configuration data
│   └── lib/               # Utility functions
├── package.json
└── README.md
```

## 🎨 Customization

### Adding New Sections

1. Create a new component in `src/components/`
2. Import and add it to `src/app/page.tsx`
3. Style with Tailwind CSS

### Modifying Animations

Animations are handled by Framer Motion. Customize them in:
- `src/components/magicui/blur-fade.tsx`
- `src/components/magicui/blur-fade-text.tsx`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sy17258/portfolio/issues).

## 👨‍💻 About Me

I'm Shivam Yadav, a Full-Stack Developer and recent MCA graduate with experience in:
- React & Node.js development
- Python & Machine Learning
- Data Science & Analytics
- Modern web technologies

**Connect with me:**
- GitHub: [@sy17258](https://github.com/sy17258)
- LinkedIn: [shivamyadav-sy](https://www.linkedin.com/in/shivamyadav-sy)
- Email: shivamydv.work@gmail.com

---

⭐ **If you found this project helpful, please give it a star!**
