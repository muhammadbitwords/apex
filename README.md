# TrustAuto - Car Marketplace Platform

A comprehensive car marketplace platform built with Next.js, featuring 200-point inspections, live auctions, and AI-powered trade-in valuations.

## 🚀 Features

### Core Features
- **Multi-User System**: Support for buyers, sellers, dealers, and admin roles
- **Car Listings**: Browse and search vehicles with advanced filtering
- **User Authentication**: Secure login and registration system
- **User Profiles**: Personalized dashboards for each user type

### Highlighted Features

#### 1. 200-Point Apex Inspection™
- Comprehensive vehicle inspection covering 5 major categories:
  - Exterior (40 points)
  - Interior (40 points)
  - Mechanical (50 points)
  - Electrical (40 points)
  - Safety (30 points)
- Detailed inspection reports with pass/warning/fail status
- Downloadable PDF reports
- Trust™ certified inspections

#### 2. Live Auctions
- Real-time bidding system with countdown timers
- Automatic bid tracking and winner determination
- Reserve price functionality
- Live bid history and notifications
- Quick bid buttons for easy bidding

#### 3. AI-Powered Trade-In Valuation
- Instant vehicle valuation using AI algorithms
- Market data analysis and competitor price comparison
- Integration with 200-point inspection scores
- Self-learning system that improves accuracy over time
- Tracks proposed vs. actual sale prices for continuous improvement
- Detailed value breakdown showing all factors

#### 4. Trust™ Trademark
- Verified sellers with community ratings
- Secure payment processing
- Transparent pricing and vehicle history
- Protected transactions with guarantees

### Additional Features
- **Admin Dashboard**: Complete platform management with analytics
- **Sales Charts**: Visual representation of revenue and sales trends
- **System Health Monitoring**: Real-time status of all platform components
- **Messaging System**: Communication between buyers and sellers
- **Favorites/Watchlist**: Save cars for later viewing
- **Transaction History**: Complete record of all purchases and sales

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Package Manager**: Bun

## 📦 Database Schema

The platform uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `cars` - Vehicle listings
- `inspection_reports` - 200-point inspection data
- `auctions` - Live auction information
- `bids` - Auction bid history
- `trade_in_valuations` - AI valuation records
- `trade_in_learning` - ML training data for AI improvement
- `messages` - User communications
- `transactions` - Purchase records
- `favorites` - User watchlists

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL 14+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   export PGUSER=your_postgres_user
   export PGPASSWORD=your_postgres_password
   ```

4. Initialize the database:
   ```bash
   createdb -h localhost car_marketplace
   psql -h localhost -U $PGUSER -d car_marketplace -f scripts/init-db.sql
   ```

5. Run the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 📱 Pages

- `/` - Homepage with hero section and feature highlights
- `/cars` - Browse all available vehicles with filters
- `/auctions` - Live auction listings with real-time bidding
- `/trade-in` - AI-powered trade-in valuation tool
- `/inspection` - Sample 200-point inspection report
- `/admin` - Admin dashboard with analytics and management tools

## 🔌 API Routes

- `GET/POST /api/cars` - Car listings management
- `GET/POST /api/auctions` - Auction management
- `GET/POST /api/bids` - Bidding system
- `GET/POST/PATCH /api/trade-in` - Trade-in valuations
- `GET/POST /api/inspection` - Inspection reports

## 🎨 Design System

The platform follows a clean, minimal design inspired by Apple, Mercury, and Attio:
- **Typography**: Inter font family with -0.02em letter spacing
- **Colors**: Neutral base palette with blue accent
- **Border Radius**: 4px, 6px, 12px, 16px, 24px based on component size
- **Borders**: rgba(0,0,0,0.05) for subtle separation

## 🤖 AI Trade-In System

The AI valuation system considers:
1. **Market Analysis**: Current market prices and trends
2. **Competitor Pricing**: Similar vehicle listings
3. **Vehicle Condition**: Based on inspection scores
4. **Mileage Adjustment**: Impact of mileage on value
5. **Market Demand**: Real-time demand indicators
6. **Self-Learning**: Improves accuracy with each transaction

The system stores learning data comparing proposed values vs. actual sale prices to continuously improve accuracy.

## 🔒 Security Features

- Secure user authentication
- Protected API routes
- SQL injection prevention
- Transaction rollback on errors
- Input validation and sanitization

## 📊 Admin Features

- Real-time platform statistics
- Sales and revenue charts
- Recent activity monitoring
- System health dashboard
- User management
- Inspection statistics

## 🌐 Live Demo

Visit the live demo at: [https://car-marketplace-2.lindy.site](https://car-marketplace-2.lindy.site)

## 📝 License

All rights reserved. Trust™ is a registered trademark.

## 🤝 Contributing

This is a demonstration project. For production use, additional features would include:
- Real-time WebSocket connections for live auctions
- Payment gateway integration
- Email notifications
- SMS alerts
- Document upload and verification
- Advanced search with Elasticsearch
- Image optimization and CDN
- Rate limiting and DDoS protection
