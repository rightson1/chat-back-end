const router = require("express").Router();
const User = require("../Models/Register");
router.post("/register", async(req, res) => {
    const email = await User.findOne({ email: req.body.email });
    const username = await User.findOne({ username: req.body.username });
    if (email) {
        return res.status(200).json("Email Already exists");
    }
    if (username) {
        return res.status(200).json("Username Already exists");
    }
    const userList = await User.find();
    const name = `Stranger-0${userList.length + 1}`;
    req.body.name = name;
    const createdUser = await User.create(req.body);
    const { password, ...data } = createdUser._doc;
    res.status(200).json(data);
});
router.post("/login", async(req, res) => {
    const username = await User.findOne({ username: req.body.username });

    if (!username) {
        return res.status(200).json("This user does not exist");
    }
    const verify = await username.verifyPassword(req.body.password);
    if (!verify) {
        return res.status(200).json("Wrong Password");
    }
    const { password, ...data } = username._doc;

    res.status(200).json(data);
});
router.put("/avatar", async(req, res) => {
    const updatedUser = await User.findOneAndUpdate({ _id: req.body._id }, { avatar: req.body.avatar }, {
        new: true,
        runValidators: true,
    });
    console.log(updatedUser);
    const { password, ...data } = updatedUser._doc;

    res.status(200).json(data);
});
router.post("/users", async(req, res) => {
    const { users } = req.body;

    const data = await Promise.all(users.map(({ _id }) => User.findOne({ _id })));

    res.status(201).json(data);
});
module.exports = router;