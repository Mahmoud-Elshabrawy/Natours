import axios from 'axios';
import { showAlert } from './alert';
import { loadStripe } from '@stripe/stripe-js';

export const bookTour = async (tourId) => {
    
    try {
        // Get stripe session
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // console.log(session);
        
        // Redirect to checkout form
        const stripePromise = loadStripe('pk_test_51S8aD3RtszgVfWMGWVpZGEucVBGk7qNPFydHGZO47NDpxi9BFv1tnMRcGuCc2haLOtwOErfCdJfhxM302iIRLfak00AbpgOkPS')
        const stripe = await stripePromise
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (err) {
        showAlert('error', err);
    }
};
