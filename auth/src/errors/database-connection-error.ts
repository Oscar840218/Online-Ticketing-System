import { ValidationError } from 'express-validator';

export class DatabaseConnectionError extends Error {

    reason = 'Can not connect to database'

    constructor() {
        super();
        Object.setPrototypeOf(this, DatabaseConnectionError);
    }
}