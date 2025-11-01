# Abune Aregawi Church Website

A full-stack MERN (MongoDB, Express, React, Node.js) web application for church management.

## Features

### Admin Features
- Post events, learnings, bibles, and songs
- Manage calendar (monthly/yearly planning)
- View member list and payment status
- Send payment reminders and notifications

### User Features
- View church events and calendar
- Join as member (10€/month subscription)
- Make general donations
- View learnings, bibles, and songs

### Payment Integration
- iDEAL (Netherlands)
- Mastercard
- Monthly membership subscriptions
- One-time donations

## Setup Instructions

1. Install dependencies:
```bash
npm run install-all
```

2. Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@church.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Church Admin
```

3. Create a `.env` file in the `client` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start MongoDB (if running locally):
```bash
# Using MongoDB locally or MongoDB Atlas cloud
# Update MONGODB_URI in server/.env
```

5. Create the admin user:
```bash
cd server
npm run create-admin
```

6. Run the application:
```bash
# From root directory
npm run dev
```

The server will run on `http://localhost:5000` and the client on `http://localhost:3000`.

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Enable iDEAL payment method in your Stripe Dashboard (Settings > Payment methods)
4. Set up webhook endpoint for handling payment events:
   - Webhook URL: `https://your-domain.com/api/payments/webhook`
   - Events to listen: `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`
   - Add the webhook secret to your `.env` file

## Default Admin Credentials

After running `npm run create-admin`:
- Email: admin@church.com (or as set in ADMIN_EMAIL)
- Password: admin123 (or as set in ADMIN_PASSWORD)

**Important**: Change these credentials after first login!

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **Payments**: Stripe (supports iDEAL and Mastercard)
- **Calendar**: FullCalendar integration

