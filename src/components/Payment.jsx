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
import { showSuccessMessage, showErrorMessage } from '../utils/toast'; // Import toast functions
import './Payment.css';

const Payment = () => {
  // 1. Get donation details from sessionStorage
  const donationDetails = JSON.parse(sessionStorage.getItem('donationDetails'));
  
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const { user } = useSelector((state) => state.user);
  
  // Redirect if details are not found
  useEffect(() => {
    if (!donationDetails) {
      showErrorMessage("Donation details not found. Returning to donation page.");
      // navigate('/donate'); // Or your relevant donation screen route
    }
  }, [donationDetails, navigate]);
  
  const getAuthToken = () => localStorage.getItem('token');

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      // --- Step 1: Create Payment Intent with Stripe ---
      const paymentData = {
        amount: donationDetails.amount,
      };
      
      const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };

      const { data } = await axios.post(
        '/api/v1/payment/process',
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) {
        payBtn.current.disabled = false;
        return;
      }

      // --- Step 2: Confirm the Card Payment ---
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        showErrorMessage(result.error.message);
        payBtn.current.disabled = false;
      } else {
        // --- Step 3: Payment Succeeded, Now Save Donation to DB ---
        if (result.paymentIntent.status === 'succeeded') {
          const donationDataForDB = {
            ...donationDetails,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
          };
          
          const token = getAuthToken();
          // Use fetch or axios to post to your original donations endpoint
          const dbResponse = await fetch('https://server-fundify.up.railway.app/api/donations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(donationDataForDB),
          });
          
          if (dbResponse.ok) {
            showSuccessMessage('Payment Successful & Donation Recorded!');
            sessionStorage.removeItem('donationDetails'); // Clean up
            navigate('/campaigns'); // Or a success page
          } else {
            const errorData = await dbResponse.json();
            showErrorMessage(`Payment succeeded but failed to save donation: ${errorData.message}`);
            payBtn.current.disabled = false;
          }
          
        } else {
          showErrorMessage("There's an issue while processing payment.");
          payBtn.current.disabled = false;
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      const errorMessage = error.response ? error.response.data.message : "An unexpected error occurred.";
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