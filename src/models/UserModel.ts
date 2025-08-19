import { Document, model, Schema } from "mongoose";
import bcrypt from "bcrypt";
interface refreshTokenInterface {
  jti: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<refreshTokenInterface>({
  jti: { type: String, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  refreshTokens: refreshTokenInterface[];
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  refreshTokens: { type: [refreshTokenSchema], default: [] },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
userSchema.pre("save", function (next) {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.expiresAt > now);
  next();
});
const UserModel = model("User", userSchema);
export default UserModel;
