const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type:Number
    },
    gender: {
        type:String,
        required: [true, "Gender is required"],
        enum: {
            values: ["male", "female", "others"],
            message: '{VALUE} is not supported'
        }
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

userSchema.index({ email: 1 }, { unique: true });
mongoose.connection.once('open', () => {
    mongoose.model('User').syncIndexes();
});

module.exports = mongoose.model("User", userSchema);