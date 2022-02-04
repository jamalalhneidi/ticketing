import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SignOut = () => {
    const router = useRouter();
    const { sendRequest, errors } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        onSuccess: () => router.push('/'),
    });
    useEffect(sendRequest, []);
    return <div>Signing out</div>;
};

export default SignOut;
