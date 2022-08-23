const notFound = (req, res) => {
    return res.status(404).json({ msg: "Still under Construcction" });
};
module.exports = notFound;