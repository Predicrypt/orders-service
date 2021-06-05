import { model, Model, Schema, Document } from 'mongoose';

interface UserAttrs {
  userId: string;
  email: string;
  apiKey?: string;
  secretKey?: string;
}

interface UserModel extends Model<any> {
  build(attrs: UserAttrs): UserDoc;
  findByUserId(userId: string): UserDoc;
}

export interface UserDoc extends Document {
  userId: string;
  email: string;
  apiKey: string;
  secretKey: string;
}

const userSchema = new Schema<any, any>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    apiKey: {
      type: String,
      required: false,
    },
    secretKey: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.secretKey;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.statics.findByUserId = async (userId: string) => {
  return await User.findOne({ userId });
};

const User = model<UserDoc, UserModel>('User', userSchema);

export default User;
