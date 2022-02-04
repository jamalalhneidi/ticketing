const Orders = ({ orders }) => {
    return (
        <ul>
            {orders.map((order) => (
                <li key={order.id}>
                    {order.ticket.title} - {order.status}
                </li>
            ))}
        </ul>
    );
};

Orders.getInitialProps = async (context, { axios }) => {
    const { data } = await axios.get('/api/orders');
    return { orders: data.orders };
};

export default Orders;
