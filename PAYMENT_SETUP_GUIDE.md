# Quick Payment Gateway Setup Guide

## 🚀 Getting Started with Stripe Payments

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Sign up" and create an account
3. Complete business verification (required for live payments)
4. Navigate to Dashboard

### Step 2: Get API Keys

#### Test Mode (for development)
1. In Stripe Dashboard, click "Developers" in top menu
2. Click "API keys"
3. Toggle to "Test mode" (top right)
4. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

#### Live Mode (for production)
1. Complete Stripe account verification
2. Toggle to "Live mode"
3. Copy the live keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### Step 3: Setup Webhook

1. In Stripe Dashboard, go to "Developers" > "Webhooks"
2. Click "Add endpoint"
3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/payments/webhook
   ```
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)

### Step 4: Configure Environment Variables

Update your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

**Important:** 
- Use `sk_test_` and `pk_test_` keys for development
- Use `sk_live_` and `pk_live_` keys for production
- Never commit these keys to version control
- Add `.env.local` to `.gitignore`

### Step 5: Test Payment Flow

1. Start your development server:
   ```bash
   bun run dev
   ```

2. Navigate to Browse Cars page:
   ```
   http://localhost:3000/cars
   ```

3. Click "Buy Now" on any vehicle

4. Login with a test account (or create one)

5. You'll be redirected to checkout page

6. Use Stripe test card:
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: Any future date (e.g., 12/25)
   CVC: Any 3 digits (e.g., 123)
   Postal Code: Any valid code (e.g., 12345)
   ```

7. Click "Pay" button

8. You should see success page with transaction details

### Step 6: Verify Payment in Stripe Dashboard

1. Go to Stripe Dashboard
2. Click "Payments" in left menu
3. You should see your test payment listed
4. Click on payment to see details

### Step 7: Check Database

Verify transaction was recorded:

```bash
psql car_marketplace
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
```

You should see your test transaction with:
- `status: 'completed'`
- `stripe_payment_intent_id: 'pi_...'`
- Correct amount and car_id

## 🧪 Test Cards

### Successful Payments
```
Card: 4242 4242 4242 4242
Result: Payment succeeds
```

### Failed Payments
```
Card: 4000 0000 0000 0002
Result: Card declined
```

### 3D Secure Authentication
```
Card: 4000 0027 6000 3184
Result: Requires 3D Secure authentication
```

### Insufficient Funds
```
Card: 4000 0000 0000 9995
Result: Insufficient funds error
```

## 🔒 Security Checklist

Before going live, ensure:

- [ ] Using live Stripe keys (not test keys)
- [ ] Webhook endpoint is HTTPS (not HTTP)
- [ ] Environment variables are secure
- [ ] `.env.local` is in `.gitignore`
- [ ] Stripe account is fully verified
- [ ] Business information is complete
- [ ] Bank account is connected (for payouts)
- [ ] SSL certificate is valid
- [ ] CORS is properly configured

## 🌍 Pakistan-Specific Setup

### Currency Configuration
Stripe supports PKR (Pakistani Rupee) by default. No additional configuration needed.

### Payment Methods
Currently supported:
- ✅ Credit/Debit cards (Visa, Mastercard, Amex)
- ✅ Digital wallets (Apple Pay, Google Pay)

Future integrations (planned):
- [ ] JazzCash
- [ ] Easypaisa
- [ ] Bank transfers

### Compliance
- Ensure compliance with State Bank of Pakistan regulations
- Register business with SECP (if required)
- Obtain necessary licenses for online payments

## 🐛 Troubleshooting

### Issue: "No API key provided"
**Solution:** Check that `STRIPE_SECRET_KEY` is set in `.env.local`

### Issue: "Invalid API key"
**Solution:** Verify you're using the correct key (test vs live mode)

### Issue: "Webhook signature verification failed"
**Solution:** Check that `STRIPE_WEBHOOK_SECRET` matches your webhook endpoint

### Issue: "Payment intent creation failed"
**Solution:** Check server logs for detailed error message

### Issue: "Card declined"
**Solution:** Use a valid test card (4242 4242 4242 4242)

### Issue: "User not found"
**Solution:** Ensure user is logged in before attempting payment

## 📊 Monitoring Payments

### Stripe Dashboard
- View all payments: Dashboard > Payments
- Check disputes: Dashboard > Disputes
- View customers: Dashboard > Customers
- Monitor webhooks: Developers > Webhooks > Logs

### Application Logs
Check server logs for payment events:
```bash
tail -f server.log | grep payment
```

### Database Queries
Monitor transactions:
```sql
-- Recent transactions
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;

-- Completed payments
SELECT * FROM transactions WHERE status = 'completed';

-- Failed payments
SELECT * FROM transactions WHERE status = 'failed';

-- Total revenue
SELECT SUM(amount) FROM transactions WHERE status = 'completed';
```

## 🎯 Going Live Checklist

Before launching to production:

1. **Stripe Account**
   - [ ] Account fully verified
   - [ ] Business information complete
   - [ ] Bank account connected
   - [ ] Tax information submitted

2. **API Keys**
   - [ ] Switch to live mode keys
   - [ ] Update environment variables
   - [ ] Test with real card (small amount)

3. **Webhook**
   - [ ] Update webhook URL to production domain
   - [ ] Verify webhook is receiving events
   - [ ] Test all event types

4. **Security**
   - [ ] HTTPS enabled
   - [ ] SSL certificate valid
   - [ ] Environment variables secure
   - [ ] No test keys in production

5. **Testing**
   - [ ] Complete end-to-end payment test
   - [ ] Verify database updates
   - [ ] Check email notifications (if enabled)
   - [ ] Test refund process

6. **Compliance**
   - [ ] Terms of Service updated
   - [ ] Privacy Policy includes payment info
   - [ ] Refund policy documented
   - [ ] Customer support ready

## 📞 Support

### Stripe Support
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com
- Status: https://status.stripe.com

### TrustAuto Support
- Email: support@trustauto.pk
- Documentation: See PAYMENT_GATEWAY_INTEGRATION.md

## 🎉 Success!

Once setup is complete, your TrustAuto platform will have:
- ✅ Secure payment processing
- ✅ Real-time payment verification
- ✅ Automatic transaction tracking
- ✅ Professional checkout experience
- ✅ PCI DSS compliance
- ✅ Support for PKR currency

**Your payment gateway is ready to accept payments!** 🚀
