import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: string;
  username: string;
  createdAt: Date;
  stats: {
    totalContributions: number;
    totalVotesReceived: number;
    storiesParticipated: number;
    dailyStreak: number;
    lastActivityDate: Date;
  };
  rewards: {
    creativityPoints: number;
    badges: string[];
    dailyRewards: Array<{
      date: Date;
      reward: string;
      claimed: boolean;
    }>;
  };
}

const UserSchema = new Schema<IUser>({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  stats: {
    totalContributions: { type: Number, default: 0 },
    totalVotesReceived: { type: Number, default: 0 },
    storiesParticipated: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: Date.now }
  },
  rewards: {
    creativityPoints: { type: Number, default: 0 },
    badges: [String],
    dailyRewards: [{
      date: Date,
      reward: String,
      claimed: { type: Boolean, default: false }
    }]
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);