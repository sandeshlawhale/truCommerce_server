const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// we use plugin becuase we don't want __v(version key) or any field marked as private
// should not be returned in the response, so for these purposes we use plugin
const { toJSON } = require("./plugins/index");
const deepEmailValidator = require("deep-email-validator");
const logger = require("../config/logger");
const allRoles = require("../config/roles");

const validateEmail = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.error("Model Error: Email is invalid");
    throw new Error("Email is invalid");
  }
};

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validateEmail,
        message: "Email is invalid",
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          logger.error("Model Error: Password must contain at least one letter and one number");
          throw new Error("Password must contain at least one letter and one number");
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    }
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
// this is used to compare a given password with the user's stored hashed password to check
// if they match
// when we get the object from the database, it has attributes like email, password
// here we have added a method which is isPasswordMatch which will directly tell us
// if the password matches or not, we have delegated the task of comparing the password here
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// this is a mongoose middleware which is executed before a user document is saved to
// database. it hashes the user's password if it has been modified
userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
