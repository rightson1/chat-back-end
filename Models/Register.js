const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const string = {
    type: String,
    required: true,
};
const UserSchema = new Schema({
    username: {
        ...string,
        unique: true,
    },
    email: {
        ...string,
        unique: true,
    },
    password: {
        ...string,
    },
    avatar: {
        type: String,
        default: "",
    },
    name: {
        type: String,
        default: "",
    },
});

UserSchema.pre("save", async function() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.verifyPassword = async function(candidate) {
    return await bcrypt.compare(candidate, this.password);
};
module.exports = model("User", UserSchema);