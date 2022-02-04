import moment from 'moment';
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const GetOrderById = ({ order, user }) => {
    const router = useRouter();
    const getSecondsRemaining = () =>
        moment(order.expiresAt).diff(moment(), 's');
    const [remaining, setRemaining] = useState(getSecondsRemaining);

    useEffect(() => {
        setRemaining(getSecondsRemaining());
        const timerId = setInterval(() => {
            const _remaining = getSecondsRemaining();
            setRemaining(_remaining);
            if (_remaining < 0) clearInterval(timerId);
        }, 1000);
        return () => {
            clearInterval(timerId);
        };
    }, []);

    const { sendRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: ({ payment }) => {
            router.push('/orders');
        },
    });

    const onToken = async (token) => {
        await sendRequest({ token: token.id });
    };

    if (remaining < 0) {
        return <div>Order Expired</div>;
    }

    return (
        <div>
            {remaining} s until order expires
            <StripeCheckout
                token={onToken}
                stripeKey="pk_test_51KPTwwD9KUtNGtN2iyGYT8H1botsMuh82rLOQE2jlzaxL3t7O7NBzqQJgGLIBwzNYB5G1HFaXiqrgSp0Fg9oKVGq00U649z95d"
                amount={order.ticket.price * 100}
                email={user.email}
            />
            {errors}
        </div>
    );
};

GetOrderById.getInitialProps = async (context, { user, axios }) => {
    const { orderId } = context.query;
    const { data } = await axios.get(`/api/orders/${orderId}`);
    return { order: data.order, user };
};

export default GetOrderById;
