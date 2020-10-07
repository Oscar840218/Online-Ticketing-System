import { CustomError } from "./custom-error";

export class BadRequestErrors extends CustomError {
    statusCode = 400;

    constructor(public msg: string) {
        super(msg);
        Object.setPrototypeOf(this, BadRequestErrors.prototype);
    }

    serializeErrors() {
        return [{message: this.msg}]
    }
}