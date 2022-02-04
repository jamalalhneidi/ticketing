const nats = {
    client: {
        publish: jest
            .fn()
            .mockImplementation((_: string, __: string, cb: () => void) => {
                cb();
            }),
    },
};

export default nats;
