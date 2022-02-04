import axios from 'axios';
import { useState } from 'react';

/**
 *
 * @param {string} url
 * @param {'get','post','patch','put'} method
 * @param {object|undefined} body
 * @param {function} onSuccess
 * @returns {{sendRequest: ((function(): Promise<void>)|*), errors: []}}
 */

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);
    const sendRequest = async (props = {}) => {
        if (errors) setErrors(null);
        try {
            const { data } = await axios[method](url, { ...body, ...props });
            if (onSuccess) onSuccess(data);
            return data;
        } catch (e) {
            console.log(e.response.data);
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oh Shit!</h4>
                    <ul className="my-0">
                        {e.response.data.errors.map((err, i) => (
                            <li key={i}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };
    return { sendRequest, errors };
};

export default useRequest;
