import { Document, Schema, model } from 'mongoose';

interface IAnalyticsSnapshot extends Document {
  date: Date;
  dau: number;
  featureUsage: {
    mood_logged: number;
    journal_created: number;
    message_sent: number;
    community_joined: number;
  };
  chatMetrics: {
    totalMessages: number;
    avgMessageLength: number;
    uniqueUsers: number;
    messagesPerUser: number;
  };
  retention: {
    day1Retention: number;
    day7Retention: number;
    day30Retention: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSnapshotSchema = new Schema<IAnalyticsSnapshot>(
  {
    date: {
      type: Date,
      required: true,
      index: true
    },
    dau: {
      type: Number,
      required: true,
      default: 0
    },
    featureUsage: {
      mood_logged: {
        type: Number,
        required: true,
        default: 0
      },
      journal_created: {
        type: Number,
        required: true,
        default: 0
      },
      message_sent: {
        type: Number,
        required: true,
        default: 0
      },
      community_joined: {
        type: Number,
        required: true,
        default: 0
      }
    },
    chatMetrics: {
      totalMessages: {
        type: Number,
        required: true,
        default: 0
      },
      avgMessageLength: {
        type: Number,
        required: true,
        default: 0
      },
      uniqueUsers: {
        type: Number,
        required: true,
        default: 0
      },
      messagesPerUser: {
        type: Number,
        required: true,
        default: 0
      }
    },
    retention: {
      day1Retention: {
        type: Number,
        required: true,
        default: 0
      },
      day7Retention: {
        type: Number,
        required: true,
        default: 0
      },
      day30Retention: {
        type: Number,
        required: true,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

const AnalyticsSnapshot = model<IAnalyticsSnapshot>(
  'AnalyticsSnapshot',
  analyticsSnapshotSchema
);

export default AnalyticsSnapshot;
