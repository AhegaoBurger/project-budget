# Budget Planner

## Overview

Budget Planner is a web application designed to help users manage their finances by tracking income, expenses, and projecting savings. This app provides an intuitive interface for users to input their financial data and visualize their budget through interactive charts.

## Features

- User Authentication: Secure login using Google OAuth
- Income Tracking: Input and categorize income sources
- Expense Management: Add and categorize expenses
- Budget Visualization: View income and expenses through interactive charts
- Savings Projection: Visualize potential savings over the next six months
- Responsive Design: Optimized for both desktop and mobile devices

## Technology Stack

- **Frontend:**
  - Next.js 13+ (React framework with App Router)
  - TypeScript
  - Tailwind CSS for styling
  - Shadcn UI for pre-built components
  - Framer Motion for animations
  - Recharts for data visualization

- **Backend:**
  - Supabase for authentication and database
  - Next.js API routes for serverless functions

- **Authentication:**
  - Supabase Auth with Google OAuth

- **Deployment:**
  - Vercel (recommended for Next.js applications)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/budget-planner.git
   cd budget-planner
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Log in using your Google account.
2. Navigate through the budget setup wizard:
   - Enter your income details
   - Add your expenses
   - View your budget summary and savings projections
3. Analyze your financial data through the provided charts and visualizations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)
