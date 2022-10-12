const notFound = (req, res) => {
    return res.status(404).json({ msg: "Still under Construction" });
};
module.exports = notFound;