import eErrors from "../../repository/errors/eErrors.js";

export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case eErrors.INVALID_TYPES_ERROR:
            res.send({ status: 'Error', error: error.name })
            break;
        default:
            res.send({ status: 'Error', error: 'Unhandled error' })
    }
}