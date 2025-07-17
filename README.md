# Shivam Yadav - Portfolio Website [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsy17258%2Fportfolio)

A modern, responsive portfolio website showcasing my journey as a Full-Stack Developer and MCA Graduate. Built with cutting-edge technologies and optimized for performance.

## 🚀 Live Demo

Visit my portfolio at: [shivamyadav.dev](https://shivamyadav.dev)

## ✨ Features

- **Easy Configuration**: Setup takes only a few minutes by editing the [single config file](./src/data/resume.ts)
- **Modern Tech Stack**: Built with Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Responsive Design**: Fully optimized for all devices (mobile, tablet, desktop)
- **Blog Integration**: Includes a blog section with MDX support
- **SEO Optimized**: Proper meta tags, sitemap, and robots.txt
- **Performance Focused**: Optimized animations and loading strategies
- **Dark/Light Mode**: Theme switching with next-themes
- **Interactive Animations**: Smooth animations with Framer Motion and Magic UI components

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Content**: MDX for blog posts
- **Deployment**: Vercel (recommended)

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

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

### Other Platforms

This project can also be deployed on:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

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
