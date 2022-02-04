import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
interface UserAttributes {
    email: string;
    password: string;
}

interface Doc extends mongoose.Document {
    email: string;
    password: string;
    checkPassword(password: string): Promise<boolean>;
}

interface Statics extends mongoose.Model<Doc> {
    build(attributes: UserAttributes): Doc;
}

const schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        toJSON: {
            transform: (doc, ret, options) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
            },
        },
    }
);

schema.statics.build = (attributes: UserAttributes) => new User(attributes);

schema.methods.checkPassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

schema.pre('save', async function (done) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    done();
});

const User = mongoose.model<Doc, Statics>('User', schema);

export default User;
