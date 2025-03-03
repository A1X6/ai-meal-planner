# AI Meal Planner

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-blue)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

AI Meal Planner is a sophisticated web application that leverages artificial intelligence to generate personalized meal plans, recipes, and shopping lists tailored to individual dietary preferences and nutritional goals.

<p align="center">
  <img src="public/screenshot.png" alt="AI Meal Planner Screenshot" width="800">
</p>

## 🚀 Features

- **AI-Powered Meal Plans**: Generates customized meal plans based on your dietary needs, preferences, and nutritional goals
- **Comprehensive Recipe Database**: Access to detailed recipes with step-by-step instructions
- **Nutritional Insights**: Detailed nutritional information and analysis for every meal and ingredient
- **Dietary Customization**: Support for various diets including vegetarian, vegan, keto, paleo, gluten-free, and more
- **Secure User Authentication**: Robust sign-up and sign-in functionality powered by Clerk
- **Meal Plan Management**: Save, edit, and access your favorite meal plans
- **Shopping Lists**: Auto-generated shopping lists for your meal plans
- **Tiered Subscription Model**: Flexible pricing options with premium features

## 💼 Subscription Plans

### Free Tier

- Generate up to 3 meal plans per month
- Access to basic recipes
- Save up to 5 favorite recipes
- Basic nutritional information

### Premium Tier - $9.99/month or $95.90/year (20% discount)

- Unlimited meal plan generation
- Access to premium recipe collection
- Detailed nutritional analysis
- Custom dietary preferences
- Shopping list generation
- Save unlimited favorite recipes

### Family Tier - $19.99/month or $191.90/year (20% discount)

- Everything in Premium
- Family-sized recipe portions
- Multiple dietary preferences per plan
- Meal prep guides for busy weeks
- Budget-friendly options
- Priority customer support

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router for server-side rendering and API routes
- **Frontend**: React 19, TailwindCSS 4 for responsive UI
- **Authentication**: [Clerk](https://clerk.dev/) for secure user management
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **AI Integration**: [OpenAI API](https://openai.com/) for intelligent meal plan generation
- **Payment Processing**: [Stripe](https://stripe.com/) for subscription management
- **Styling & Animation**: TailwindCSS, Framer Motion for smooth transitions
- **Deployment**: [Vercel](https://vercel.com/) for serverless deployment

## 📊 Database Schema

### Profile Model

- User information and subscription details
- Tracks usage limits and plan type
- Links to saved meal plans

### SavedMealPlan Model

- Stores generated meal plans
- Links to user profiles
- Includes creation and update timestamps

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database
- Clerk account for authentication
- OpenAI API key
- Stripe account for payment processing

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/A1X6/ai-meal-planner.git
   cd ai-meal-planner
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   # Database Connection
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

   # Clerk Authentication
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/subscribe
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/create-profile
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/subscribe
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/create-profile

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key
   # Or OpenRouter API (alternative)
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Stripe Payment Integration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=your_premium_monthly_price_id
   NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=your_premium_yearly_price_id
   NEXT_PUBLIC_STRIPE_FAMILY_MONTHLY_PRICE_ID=your_family_monthly_price_id
   NEXT_PUBLIC_STRIPE_FAMILY_YEARLY_PRICE_ID=your_family_yearly_price_id

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Initialize and seed the database:

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Apply migrations to database
   npx prisma db push

   # (Optional) Seed database with initial data
   npx prisma db seed
   ```

5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧪 Development

This project follows modern development practices:

- **TypeScript**: For type safety and improved developer experience
- **ESLint**: For code quality and consistency
- **Prisma**: For type-safe database access
- **React Query**: For efficient server state management
- **TailwindCSS**: For utility-first styling
- **Jest/Testing Library**: For unit and integration testing (to be implemented)

## 📱 Application Flow

1. **User Registration**: Users sign up via Clerk authentication
2. **Profile Creation**: New users create a profile with dietary preferences
3. **Subscription Selection**: Users choose a subscription plan (Free, Premium, or Family)
4. **Meal Plan Generation**: Users generate meal plans based on their preferences
5. **Plan Management**: Users can save, view, and modify their meal plans
6. **Shopping List**: Generate shopping lists from meal plans

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Set up your PostgreSQL database (Neon, Supabase, or other providers)
5. Configure Stripe webhook endpoints
6. Deploy!

## 🔄 CI/CD

Implement continuous integration and deployment:

1. Set up GitHub Actions for automated testing
2. Configure Vercel for preview deployments
3. Implement database migration scripts

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Open a Pull Request

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for the AI capabilities
- [Next.js](https://nextjs.org/) for the React framework
- [Clerk](https://clerk.dev/) for authentication services
- [Prisma](https://www.prisma.io/) for database access
- [Stripe](https://stripe.com/) for payment processing
- [Vercel](https://vercel.com/) for hosting and deployment
- [TailwindCSS](https://tailwindcss.com/) for styling
