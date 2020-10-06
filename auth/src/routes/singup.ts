import { DatabaseConnectionError } from './../errors/database-connection-error';
import { RequestValidationError } from './../errors/request-validation-error';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';


const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Length must between 4~20')
], (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }
    const { email, body } = req.body;

    console.log('Create user');

    throw new DatabaseConnectionError();

    res.send({});
});

export { router as signupRouter };