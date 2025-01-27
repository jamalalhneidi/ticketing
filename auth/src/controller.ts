import { Exception } from '@jagittix/common';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from './models/User';

export const currentUser = async (req: Request, res: Response) => {
    res.status(200).send({ user: req.user });
};

export const signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const exists = await User.exists({ email });
    if (exists)
        throw new Exception(400, {
            errors: [
                {
                    field: 'email',
                    message: 'A user with the same email address exists!',
                },
            ],
        });
    const user = User.build({ email, password });
    await user.save();

    jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!,
        {},
        (err, encoded) => {
            if (err) throw new Exception(500, err.message);
            // @ts-ignore
            req.session.token = encoded;
            res.status(201).send(user);
        }
    );
};

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.checkPassword(password)))
        throw new Exception(400, `Invalid credentials`);

    jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!,
        {},
        (err, encoded) => {
            if (err) throw new Exception(500, err.message);
            // @ts-ignore
            req.session.token = encoded;
            res.status(200).send(user);
        }
    );
};

export const signOut = (req: Request, res: Response) => {
    req.session = null;
    res.status(200).end();
};
