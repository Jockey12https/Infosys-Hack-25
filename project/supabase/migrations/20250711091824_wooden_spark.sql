/*
  # Payment System Setup

  1. New Tables
    - `payment_methods` - Store user payment methods (cards, UPI, etc.)
    - `transactions` - Track all financial transactions
    - `payouts` - Track payments to guides
    - `merchant_accounts` - Store guide merchant/bank details

  2. Security
    - Enable RLS on all payment tables
    - Add policies for users to manage their own payment data
    - Add policies for transaction visibility

  3. Features
    - Multiple payment methods per user
    - Transaction tracking with status
    - Automatic payout calculations
    - Merchant account verification
*/

-- Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('card', 'upi', 'netbanking', 'wallet')),
  provider text, -- visa, mastercard, paytm, gpay, etc.
  last_four text, -- last 4 digits for cards
  upi_id text, -- for UPI payments
  is_default boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  metadata jsonb DEFAULT '{}', -- store additional payment method details
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  payer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  payee_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  payment_method_id uuid REFERENCES payment_methods(id),
  amount integer NOT NULL, -- amount in paise/cents
  currency text DEFAULT 'INR',
  type text NOT NULL CHECK (type IN ('booking_payment', 'refund', 'payout', 'fee')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  gateway text, -- razorpay, stripe, paytm, etc.
  gateway_transaction_id text,
  gateway_response jsonb DEFAULT '{}',
  description text,
  fees integer DEFAULT 0, -- platform fees in paise
  net_amount integer, -- amount after fees
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Merchant Accounts Table (for guides to receive payments)
CREATE TABLE IF NOT EXISTS merchant_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid REFERENCES guides(id) ON DELETE CASCADE,
  account_type text NOT NULL CHECK (account_type IN ('bank_account', 'upi', 'wallet')),
  bank_name text,
  account_number text,
  ifsc_code text,
  account_holder_name text,
  upi_id text,
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_documents jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payouts Table (track payments to guides)
CREATE TABLE IF NOT EXISTS payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid REFERENCES guides(id) ON DELETE CASCADE,
  merchant_account_id uuid REFERENCES merchant_accounts(id),
  amount integer NOT NULL, -- amount in paise
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payout_date date,
  gateway_payout_id text,
  gateway_response jsonb DEFAULT '{}',
  transaction_ids uuid[], -- array of transaction IDs included in this payout
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Payment Methods
CREATE POLICY "Users can manage own payment methods"
  ON payment_methods
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for Transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (payer_id = auth.uid() OR payee_id = auth.uid());

CREATE POLICY "System can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (payer_id = auth.uid());

-- RLS Policies for Merchant Accounts
CREATE POLICY "Guides can manage own merchant accounts"
  ON merchant_accounts
  FOR ALL
  TO authenticated
  USING (guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()))
  WITH CHECK (guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()));

-- RLS Policies for Payouts
CREATE POLICY "Guides can view own payouts"
  ON payouts
  FOR SELECT
  TO authenticated
  USING (guide_id IN (SELECT id FROM guides WHERE user_id = auth.uid()));

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payer_id ON transactions(payer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payee_id ON transactions(payee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_merchant_accounts_guide_id ON merchant_accounts(guide_id);
CREATE INDEX IF NOT EXISTS idx_payouts_guide_id ON payouts(guide_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);

-- Function to calculate platform fees (10% of booking amount)
CREATE OR REPLACE FUNCTION calculate_platform_fee(booking_amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN ROUND(booking_amount * 0.10);
END;
$$;

-- Function to create transaction for booking payment
CREATE OR REPLACE FUNCTION create_booking_transaction(
  p_booking_id uuid,
  p_payer_id uuid,
  p_payee_id uuid,
  p_amount integer,
  p_payment_method_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_transaction_id uuid;
  v_fees integer;
  v_net_amount integer;
BEGIN
  -- Calculate fees and net amount
  v_fees := calculate_platform_fee(p_amount);
  v_net_amount := p_amount - v_fees;
  
  -- Create transaction
  INSERT INTO transactions (
    booking_id,
    payer_id,
    payee_id,
    payment_method_id,
    amount,
    type,
    fees,
    net_amount,
    description
  ) VALUES (
    p_booking_id,
    p_payer_id,
    p_payee_id,
    p_payment_method_id,
    p_amount,
    'booking_payment',
    v_fees,
    v_net_amount,
    'Payment for village experience booking'
  ) RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$;

-- Sample payment methods for testing
INSERT INTO payment_methods (user_id, type, provider, last_four, is_default, is_verified)
SELECT 
  p.id,
  'card',
  'visa',
  '4532',
  true,
  true
FROM profiles p
WHERE p.email LIKE '%@example.com'
LIMIT 3;

INSERT INTO payment_methods (user_id, type, upi_id, is_default, is_verified)
SELECT 
  p.id,
  'upi',
  p.email,
  false,
  true
FROM profiles p
WHERE p.email LIKE '%@example.com'
LIMIT 3;