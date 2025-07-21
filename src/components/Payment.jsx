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

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const paymentData = {
        amount: donationDetails.amount,
      };
      
      const token = getAuthToken();
      const config = { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <-- Add this line
       } 
      };

      const { data } = await axios.post(
        `https://server-fundify.up.railway.app/api/v1/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

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
        if (result.paymentIntent.status === 'succeeded') {
          const donationDataForDB = {
            ...donationDetails,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
          };
          
          const token = getAuthToken();
          // Use axios consistently
          const dbConfig = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          };

          await axios.post(`https://server-fundify.up.railway.app/api/donations`, donationDataForDB, dbConfig);
          
          showSuccessMessage('Payment Successful & Donation Recorded!');
          sessionStorage.removeItem('donationDetails');
          navigate('/submit-2'); // Navigate to a success page
        } else {
          showErrorMessage("There's an issue while processing payment.");
          payBtn.current.disabled = false;
        }
      }
    } catch (error) {
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