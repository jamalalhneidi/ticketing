import index from '../index';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const GetTicketById = ({ ticket }) => {
    const router = useRouter();
    const { sendRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id,
        },
        onSuccess: ({ order }) => {
            router.push('/orders/[orderId]', `/orders/${order.id}`);
        },
    });

    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price} €</h4>
            <button onClick={() => sendRequest()} className="btn btn-primary">
                Purchase
            </button>
            {errors}
        </div>
    );
};

GetTicketById.getInitialProps = async (context, { user, axios }) => {
    const { ticketId } = context.query;
    const { data } = await axios.get(`/api/tickets/${ticketId}`);
    return { ticket: data.ticket };
};

export default GetTicketById;
