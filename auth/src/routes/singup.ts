import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator'

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Length must between 4~20')
], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Error('Invalid email or password')
    }
    const { email, body } = req.body;

    console.log('Create user');
    res.send({});
});

export { router as signupRouter };