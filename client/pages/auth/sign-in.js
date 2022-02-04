import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { sendRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email,
            password,
        },
        onSuccess: () => {
            router.push('/');
        },
    });
    const onSubmit = async (event) => {
        event.preventDefault();
        await sendRequest();
    };
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign in</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign in</button>
        </form>
    );
};
export default SignIn;
