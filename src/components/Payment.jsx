import React, { Fragment, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { showSuccessMessage, showErrorMessage } from '../utils/toast';
import './Payment.css';

const Payment = () => {
  const donationDetails = JSON.parse(sessionStorage.getItem('donationDetails'));
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!donationDetails) {
      showErrorMessage("Donation details not found. Returning to donation page.");
      navigate('/donate');
    }
  }, [donationDetails, navigate]);
  
  const getAuthToken = () => localStorage.getItem('token');

  // In Payment.jsx

const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
        const token = getAuthToken();
        if (!token) {
            showErrorMessage("You must be logged in.");
            payBtn.current.disabled = false;
            navigate('/login');
            return;
        }

        console.log("Step 1: Sending request to create Payment Intent...");
        
        const paymentData = { amount: donationDetails.amount };
        const API_URL = process.env.REACT_APP_API_URL;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        
        const { data } = await axios.post(
            `${API_URL}/api/payment/process`,
            paymentData,
            config
        );

        console.log("Step 2: Received response from backend:", data);

        const client_secret = data.client_secret;

        if (!client_secret) {
            console.error("FATAL: client_secret not found in backend response!");
            showErrorMessage("Failed to initialize payment from server.");
            payBtn.current.disabled = false;
            return;
        }

        if (!stripe || !elements) return;

        console.log("Step 3: Confirming card payment with Stripe...");
        const result = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardNumberElement),
                billing_details: {
                    name: user.name,
                    email: user.email,
                },
            },
        });

        console.log("Step 4: Stripe confirmation result:", result);

        if (result.error) {
            // This is likely where the error is.
            // For example, using an invalid test card number.
            showErrorMessage(result.error.message);
            payBtn.current.disabled = false;
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log("Step 5: Payment Succeeded! Saving to DB...");
                // ... your logic to save the donation ...
                showSuccessMessage('Payment Successful & Donation Recorded!');
                sessionStorage.removeItem('donationDetails');
                navigate('/submit-2');
            } else {
                showErrorMessage("Payment not successful.");
                payBtn.current.disabled = false;
            }
        }
    } catch (error) {
        console.error("An error occurred in submitHandler:", error);
        payBtn.current.disabled = false;
        const errorMessage = error.response ? error.response.data.message : "An unexpected network error occurred.";
        showErrorMessage(errorMessage);
    }
};

  return (
    <Fragment>
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - PKR ${donationDetails ? donationDetails.amount.toLocaleString() : '0'}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;