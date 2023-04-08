const mongoose = require('mongoose');
const errorCode = require("../data/errorCode");


function handleError(res, err) {
    console.log(err);

    if (err.name === 'CustomValidationError') {
        return res.status(400).json({
            error: "CustomValidationError",
            message: err.errors
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: errorCode.MISSING_FIELDS.code,
            message: err.message
        });
    }

    if (err.code === errorCode.AUTHENTICATION_FAILED.code) {
        return res.status(401).json({
            error: errorCode.AUTHENTICATION_FAILED.code,
            message: err.message || errorCode.AUTHENTICATION_FAILED.message
        });
    }

    if (err.name === 'not_found') {
        return res.status(409).json({
            error: err.name,
            message: err.message
        });
    }

    if (err.name === errorCode.ALREADY_EXISTS.code) {
        return res.status(410).json({
            error: errorCode.ALREADY_EXISTS.code,
            message: err.message
        });
    }

    if (err.name === errorCode.UNAUTHORIZED_ACCESS.code) {
        return res.status(403).json({
            error: errorCode.UNAUTHORIZED_ACCESS.code,
            message: errorCode.UNAUTHORIZED_ACCESS.message
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: errorCode.UNAUTHORIZED_ACCESS.code,
            message: errorCode.UNAUTHORIZED_ACCESS.message
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: errorCode.UNAUTHORIZED_ACCESS.code,
            message: errorCode.UNAUTHORIZED_ACCESS.message
        });
    }

    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            error: errorCode.MISSING_FIELDS.code,
            message: err.message
        });
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(404).json({
            error: errorCode.USER_NOT_FOUND.code,
            message: 'User not found'
        });
    }

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(404).json({
            error: errorCode.USER_NOT_FOUND.code,
            message: 'User not found'
        });
    }

    if (err.code === 11000) {
        return res.status(409).json({
            error: errorCode.ALREADY_EXISTS.code,
            message: errorCode.ALREADY_EXISTS.message
        });
    }


    return res.status(500).json({
        error: errorCode.SERVER_ERROR.code,
        message: errorCode.SERVER_ERROR.message
    });
}


module.exports = handleError;