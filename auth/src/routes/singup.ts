import { BadRequestErrors } from './../errors/bad-request-error';
import { RequestValidationError } from './../errors/request-validation-error';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user'

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Length must between 4~20')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    console.log('Creating user...');

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log('Email in use');
        throw new BadRequestErrors('Email in used!')
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).send(user);
});

export { router as signupRouter };