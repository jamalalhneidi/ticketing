import axios from 'axios';

const buildAxios = (opt) => {
    if (typeof window === 'undefined')
        return axios.create({
            baseURL:
                'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: opt.req?.headers,
        });
    else {
        return axios.create();
    }
};

export default buildAxios;
