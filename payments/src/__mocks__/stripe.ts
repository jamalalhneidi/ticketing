const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({ id: 'asdlasdasl' }),
    },
};

export default stripe;
