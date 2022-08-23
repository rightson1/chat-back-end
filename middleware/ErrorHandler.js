const ErrorHandler = (error, req, res, next) => {
    const custom = {
        msg: error.message || "There was an error",
        status: error.status || 500,
    };
    res.status(custom.status).json({ msg: custom.msg });
};
module.exports = ErrorHandler;