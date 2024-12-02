import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  title: string;
  theme: string;
  status: 'active' | 'completed';
  createdAt: Date;
  contributions: Array<{
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    content: string;
    imageUrl?: string;
    votes: number;
    createdAt: Date;
  }>;
  settings: {
    maxParticipants: number;
    contributionMaxLength: number;
    allowImageGeneration: boolean;
    isPrivate: boolean;
  };
}

const StorySchema = new Schema<IStory>({
  title: { type: String, required: true },
  theme: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  contributions: [{
    _id: { type: Schema.Types.ObjectId, ref: 'Contribution' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    imageUrl: String,
    votes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  settings: {
    maxParticipants: { type: Number, default: 10 },
    contributionMaxLength: { type: Number, default: 280 },
    allowImageGeneration: { type: Boolean, default: true },
    isPrivate: { type: Boolean, default: false }
  }
});

export const Story = mongoose.model<IStory>('Story', StorySchema);