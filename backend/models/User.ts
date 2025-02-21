import mongoose, { HydratedDocument, Model } from "mongoose";
import bcrypt from "bcrypt";
import { UserFields } from "../types";
import { randomUUID } from "node:crypto";

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const reqEmail = /^(\w+[-.]?\w+)@(\w+)([.-]?\w+)?(\.[a-zA-Z]{2,3})$/;

const UserSchema = new Schema<
  HydratedDocument<UserFields>,
  UserModel,
  UserMethods
>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      {
        validator: async function (
          this: HydratedDocument<UserFields>,
          value: string,
        ): Promise<boolean> {
          if (!this.isModified("email")) return true;
          const user: UserFields | null = await User.findOne({
            email: value,
          });
          return !user;
        },
        message: "This email is already taken",
      },
      {
        validator: async function (
          this: HydratedDocument<UserFields>,
          value: string,
        ): Promise<boolean> {
          return reqEmail.test(value);
        },
        message: "Invalid email format",
      },
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin"],
  },
  token: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  googleId: String,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
};
UserSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
