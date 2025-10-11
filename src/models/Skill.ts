import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  description?: string;
  tools?: string[];
  userId: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  title: {
    type: String,
    required: [true, 'Skill title is required'],
    trim: true,
    maxlength: [100, 'Skill title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  tools: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tool name cannot exceed 50 characters']
  }],
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
SkillSchema.index({ userId: 1, order: 1 });
SkillSchema.index({ userId: 1, isActive: 1 });

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
