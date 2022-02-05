import mongoose from 'mongoose';
import app from './app';

const PORT = 3000;

const start = async () => {
    console.log('Starting up');
    const { JWT_KEY, MONGO_URI } = process.env;
    if (!JWT_KEY || !MONGO_URI) throw new Error('ENV VARS missing');
    await mongoose.connect(MONGO_URI);
    console.log(
        `Connected to ${MONGO_URI.substring(
            MONGO_URI.indexOf('//') + 2,
            MONGO_URI.indexOf('27017') - 1
        )} DB`
    );
    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });
};
const s = 'mongodb://auth-mongo-srv:27017/auth';
s.substring(s.indexOf('//') + 2, s.indexOf('27017') - 1);

start().catch((e) => {
    console.log('Could not connect to DB');
    console.error(e);
});
