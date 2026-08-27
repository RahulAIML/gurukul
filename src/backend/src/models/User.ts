import mongoose, { Schema, type InferSchemaType } from 'mongoose';

/**
 * Identity only. Fitness data lives in FitnessProfile so the personalization
 * shape can change without touching credentials.
 */
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      // Stored lowercase so uniqueness is case-insensitive. Without this,
      // Alice@example.com and alice@example.com become two accounts.
      lowercase: true,
      trim: true,
      index: true,
    },
    // Display name only — it is greeted in the header, never used to identify
    // an account. Optional because an account is valid without one, and a
    // required "real name" field is a barrier with no security value.
    name: { type: String, trim: true, maxlength: 80, default: '' },
    // `select: false` so a stray `User.findOne()` cannot pull the hash into
    // scope where it might be serialised.
    passwordHash: { type: String, required: true, select: false },
    emailVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Second layer on the most dangerous field in the schema: even if a caller
// explicitly selects it, it cannot survive serialisation.
userSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User = mongoose.model('User', userSchema);
