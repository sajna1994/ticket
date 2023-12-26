const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    userId: {
        String,
    },
    username: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

})

const UserModel = mongoose.model('movieuser', UserSchema);
module.exports = UserModel;