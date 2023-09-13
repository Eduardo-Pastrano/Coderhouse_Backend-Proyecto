class CustomError extends Error {
    constructor({ name, message, code, cause }) {
        super(message);
        this.name = name;
        this.code = code;
        this.cause = cause;
    }

    static createError({ name, message, code, cause }) {
        return new CustomError({ name, message, code, cause });
    }
}

export default CustomError;