import { validateRequest } from './../middlewares/validate-request';
import { BadRequestErrors } from './../errors/bad-request-error';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user'

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Length must between 4~20')
], validateRequest, async (req: Request, res: Response) => {

    console.log('Creating user...');

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log('Email in use');
        throw new BadRequestErrors('Email in used!')
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJWT = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);

    // Store in session
    req.session = {
        jwt: userJWT
    };

    res.status(201).send(user);
});

export { router as signupRouter };