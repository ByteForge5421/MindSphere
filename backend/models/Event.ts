import mongoose, { Document, Schema } from 'mongoose';

interface IEvent extends Document {
  userId: mongoose.Types.ObjectId;
  eventType: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    eventType: {
      type: String,
      required: true,
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    }
  }
);

// Add compound indexes for efficient querying
EventSchema.index({ eventType: 1, createdAt: -1 });
EventSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IEvent>('Event', EventSchema);
