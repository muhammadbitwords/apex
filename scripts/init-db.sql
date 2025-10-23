-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('buyer', 'seller', 'dealer', 'admin')),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  condition VARCHAR(50) NOT NULL,
  transmission VARCHAR(50),
  fuel_type VARCHAR(50),
  color VARCHAR(50),
  vin VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'auction', 'pending')),
  images TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 200-Point Inspection Reports
CREATE TABLE IF NOT EXISTS inspection_reports (
  id SERIAL PRIMARY KEY,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  inspector_id INTEGER REFERENCES users(id),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 200),
  exterior_score INTEGER,
  interior_score INTEGER,
  mechanical_score INTEGER,
  electrical_score INTEGER,
  safety_score INTEGER,
  detailed_report JSONB,
  inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auctions table
CREATE TABLE IF NOT EXISTS auctions (
  id SERIAL PRIMARY KEY,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  starting_price DECIMAL(10, 2) NOT NULL,
  current_bid DECIMAL(10, 2),
  reserve_price DECIMAL(10, 2),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled')),
  winner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bids table
CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER REFERENCES auctions(id) ON DELETE CASCADE,
  bidder_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10, 2) NOT NULL,
  bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_winning BOOLEAN DEFAULT false
);

-- Trade-in valuations
CREATE TABLE IF NOT EXISTS trade_in_valuations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  car_id INTEGER REFERENCES cars(id),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  condition VARCHAR(50),
  inspection_score INTEGER,
  market_value DECIMAL(10, 2),
  competitor_avg_price DECIMAL(10, 2),
  ai_suggested_value DECIMAL(10, 2),
  final_offer DECIMAL(10, 2),
  valuation_data JSONB,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Trade-in learning data
CREATE TABLE IF NOT EXISTS trade_in_learning (
  id SERIAL PRIMARY KEY,
  valuation_id INTEGER REFERENCES trade_in_valuations(id),
  proposed_value DECIMAL(10, 2) NOT NULL,
  actual_sale_price DECIMAL(10, 2),
  difference DECIMAL(10, 2),
  accuracy_percentage DECIMAL(5, 2),
  market_conditions JSONB,
  learned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_car_id INTEGER REFERENCES cars(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  buyer_id INTEGER REFERENCES users(id),
  seller_id INTEGER REFERENCES users(id),
  car_id INTEGER REFERENCES cars(id),
  auction_id INTEGER REFERENCES auctions(id),
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('purchase', 'auction_win', 'trade_in')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, car_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_seller ON cars(seller_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_car_id ON transactions(car_id);

CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_trade_in_user ON trade_in_valuations(user_id);

-- Create installment plans table
CREATE TABLE IF NOT EXISTS installment_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  car_id INTEGER REFERENCES cars(id),
  total_amount INTEGER NOT NULL,
  down_payment INTEGER NOT NULL,
  monthly_payment INTEGER NOT NULL,
  number_of_months INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create installment payments table
CREATE TABLE IF NOT EXISTS installment_payments (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES installment_plans(id),
  installment_number INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  due_date DATE NOT NULL,
  paid_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for installment tables
CREATE INDEX IF NOT EXISTS idx_installment_plans_user ON installment_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_installment_plans_car ON installment_plans(car_id);
CREATE INDEX IF NOT EXISTS idx_installment_payments_plan ON installment_payments(plan_id);
CREATE INDEX IF NOT EXISTS idx_installment_payments_status ON installment_payments(status);
