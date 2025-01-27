import Link from 'next/link';

const index = ({ user, tickets }) => {
    console.log(user);
    const ticketList = tickets?.map((ticket) => {
        return (
            <tr key={ticket.id}>
                <td>
                    <Link
                        href={'tickets/[ticketId]'}
                        as={`tickets/${ticket.id}`}
                    >
                        <a>{ticket.title}</a>
                    </Link>
                </td>
                <td>{ticket.price} €</td>
            </tr>
        );
    });

    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{ticketList}</tbody>
            </table>
        </div>
    );
};

index.getInitialProps = async (context, { user, axios }) => {
    const { data } = await axios.get('/api/tickets');
    return { tickets: data.tickets };
};

export default index;
