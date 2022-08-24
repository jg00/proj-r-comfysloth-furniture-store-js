/*
Functions will be available every where in our app. These functions will only be on the server

End point
POST domain/.netlify/functions/create-payment-intent
Note we would get an error if we try to access end point directly from the
browser because that would be a GET request and event.body would not exits.

Now at this end point we can communicate with Stripe to create a stripe payment intent and get back a stripe client token.

Environment variables
To access and keep safe, in Node land, we can use dotenv package that helps us to access environment variables.
All we need is to require 'dotenv' and invoke config.
If the .env file is in the root then we have access to the variables else we can provide a path in the config
Here in Node we did not have to prefix our environment variable with REACT_APP_...

Cart and total amount calculation (calculateOrderAmount())
Normally you would it is on the server where we would iterate over the cart, grad the
ids, connect to your own API, and then grab the actual cost.
Here for demonstration with stripe we will just use the cart values we passed into this end point.

Calculate the order total on the server to prevent people from directly manipulating the amount on the client
*/

require("dotenv").config();

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  // Handle POST request
  if (event.body) {
    const { cart, shipping_fee, total_amount } = JSON.parse(event.body);

    // Calculate the order total on the server to prevent people from directly manipulating the amount on the client
    const calculateOrderAmount = () => {
      return shipping_fee + total_amount;
    };

    try {
      // Create a PaymentIntent with the order amount and currency and returns client_secret
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: "usd",
      });

      // Send back client_secret to our StripeCheckout
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: error.message }),
      };
    }
  }

  // Handle GET request ie directly from browser
  return {
    statusCode: 200,
    body: "Create Payment Intent",
  };
};
