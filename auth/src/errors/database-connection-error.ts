import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {

    statusCode = 500;
    reason = 'Can not connect to database'

    constructor() {
        super('Can not connect to database');
        Object.setPrototypeOf(this, DatabaseConnectionError);
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}