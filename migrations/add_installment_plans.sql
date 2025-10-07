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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_installment_plans_user ON installment_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_installment_plans_car ON installment_plans(car_id);
CREATE INDEX IF NOT EXISTS idx_installment_payments_plan ON installment_payments(plan_id);
CREATE INDEX IF NOT EXISTS idx_installment_payments_status ON installment_payments(status);
