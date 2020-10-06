import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionError } from './../errors/database-connection-error';
import { RequestValidationError } from './../errors/request-validation-error';

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (err instanceof RequestValidationError) {
        const formattedErros = err.errors.map(error => {
            return { message: error.msg, feild: error.param };
        });
        return res.status(400).send({ erros: formattedErros });
    }

    if (err instanceof DatabaseConnectionError) {
        return res.status(500).send({ errors: [
            { message: err.reason }
        ] });
    }

    res.status(400).send({message: 'Something went wrong'});
};