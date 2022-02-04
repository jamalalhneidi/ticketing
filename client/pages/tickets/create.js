import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const Create = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const { sendRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price,
        },
        onSuccess: (data) => {
            router.push('/');
        },
    });

    const onBlur = (e) => {
        const value = parseFloat(e.target.value).toFixed(2);
        setPrice(value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await sendRequest();
    };

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        className="form-control"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        className="form-control"
                        type="number"
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default Create;
