import * as _nats from 'node-nats-streaming';
import { Stan } from 'node-nats-streaming';

class NatsClient {
    private _client?: _nats.Stan;

    get client(): Stan {
        if (!this._client) throw new Error('NATS client not initialized');
        return this._client;
    }

    connect(clusterId: string, clientId: string, opt: { url: string }) {
        this._client = _nats.connect(clusterId, clientId, opt);
        return new Promise<void>((resolve, reject) => {
            this._client!.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            this._client!.on('error', (err) => {
                reject(err);
            });
        });
    }
}

const nats = new NatsClient();
export default nats;
