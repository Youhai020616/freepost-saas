# Freepost SaaS

> 🚀 A modern social media management platform built with Next.js 15 and TypeScript

Freepost is a comprehensive social media management SaaS platform that allows users to schedule, manage, and analyze their social media content across multiple platforms.

## ✨ Features

- 🎯 **Multi-workspace Management** - Organize your social media accounts by workspace
- 📝 **Content Scheduling** - Schedule posts across multiple social platforms
- 📊 **Analytics Dashboard** - Track performance and engagement metrics
- 💳 **Subscription Management** - Integrated billing with Stripe
- 🔐 **Secure Authentication** - Powered by BetterAuth
- 📱 **Responsive Design** - Beautiful UI built with Tailwind CSS and Radix UI
- ⚡ **Modern Tech Stack** - Built with the latest Next.js 15 features

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Server Actions  
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL for production)
- **Authentication**: BetterAuth
- **Payments**: Stripe
- **Deployment**: Vercel
- **Package Manager**: pnpm
- **Architecture**: Monorepo with workspaces

## 📁 Project Structure

```
freepost-saas/
├── apps/
│   ├── web/          # Next.js web application
│   └── api/          # API server (if needed)
├── packages/
│   ├── db/           # Database schema and client
│   └── types/        # Shared TypeScript types
├── pnpm-workspace.yaml
└── vercel.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Youhai020616/freepost-saas.git
   cd freepost-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database (SQLite for development)
   DATABASE_URL="file:./prisma/dev.db"
   
   # Authentication
   AUTH_SECRET="your-secret-key"
   
   # Stripe (for billing)
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at:
   - 🌐 **Web**: http://localhost:3000
   - 🔌 **API**: http://localhost:8787

   > 💡 **遇到端口占用？** 查看 [快速启动指南](./QUICKSTART.md) 或运行 `pnpm cleanup`

## 📚 Available Scripts

```bash
# Development
pnpm dev          # 智能启动开发服务器（推荐）
pnpm dev:clean    # 清理端口后启动
pnpm dev:web      # 仅启动 Web 应用
pnpm dev:api      # 仅启动 API 服务
pnpm cleanup      # 清理占用的端口
pnpm build        # Build all apps for production
pnpm start        # Start production builds

# Database
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio

# Linting
pnpm lint         # Run ESLint across all packages
```

## 🗄️ Database Schema

### Core Models

- **User** - User accounts and authentication
- **Workspace** - Organization/team workspaces
- **Membership** - User-workspace relationships
- **SocialAccount** - Connected social media accounts
- **Post** - Social media posts and content
- **Media** - File uploads and media management
- **SchedulerJob** - Scheduled post jobs
- **Subscription** - Billing and subscription management
- **Log** - System logs and audit trail
- **Cache** - Application caching layer

## 🌐 API Endpoints

### Workspaces
- `POST /api/workspaces` - Create new workspace
- `GET /api/workspaces` - List user workspaces

### Social Accounts  
- `POST /api/social-accounts` - Connect social account
- `GET /api/social-accounts` - List connected accounts

### Posts
- `GET /api/posts` - List posts
- `POST /api/posts` - Create new post
- `PATCH /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/publish` - Publish post immediately

### Media
- `POST /api/media/upload` - Upload media files

### Billing
- `GET /api/billing/plans` - List subscription plans
- `POST /api/billing/checkout` - Create checkout session

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your GitHub repository in Vercel
   - The `vercel.json` configuration will handle the monorepo setup automatically

3. **Environment Variables**
   Configure the following in Vercel dashboard:
   ```env
   DATABASE_URL=your-postgresql-connection-string
   AUTH_SECRET=your-production-secret
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```

4. **Database Migration**
   ```bash
   # Run migrations on production database
   pnpm db:migrate:deploy
   ```

### Vercel Cron Jobs

Configure cron jobs in Vercel to handle scheduled posts:
- Endpoint: `POST /api/cron/publish`
- Schedule: Every minute (`* * * * *`)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](https://github.com/Youhai020616/freepost-saas/wiki)

---

Made with ❤️ by the Freepost team
