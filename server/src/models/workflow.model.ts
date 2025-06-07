// server/src/models/workflow.model.ts
import { Schema, model, Document, Types } from 'mongoose';

// Interfaces for type safety
export interface INode {
  id: string;
  name: string;
  type: 'start' | 'task' | 'decision' | 'end';
  position?: {
    x: number;
    y: number;
  };
  data?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransition {
  id: string;
  from: string; // Source node ID
  to: string;   // Target node ID
  condition?: string; // Optional condition for the transition
  label?: string;     // Display label for the transition
  data?: Record<string, any>;
}

export interface IWorkflow extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  nodes: INode[];
  transitions: ITransition[];
  status: 'draft' | 'active' | 'inactive' | 'archived';
  version: number;
  createdBy?: string; // User ID who created the workflow
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Node Schema
const NodeSchema = new Schema<INode>({
  id: {
    type: String,
    required: true,
    unique: false // Unique within a workflow, not globally
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['start', 'task', 'decision', 'end'],
    required: true,
    default: 'task'
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  _id: false // Prevent MongoDB from creating _id for subdocuments
});

// Transition Schema
const TransitionSchema = new Schema<ITransition>({
  id: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true,
    ref: 'Node'
  },
  to: {
    type: String,
    required: true,
    ref: 'Node'
  },
  condition: {
    type: String,
    trim: true,
    maxlength: 500
  },
  label: {
    type: String,
    trim: true,
    maxlength: 100
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  _id: false
});

// Main Workflow Schema
const WorkflowSchema = new Schema<IWorkflow>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  nodes: {
    type: [NodeSchema],
    required: true,
    validate: {
      validator: function (nodes: INode[]) {
        // Ensure at least one node exists
        if (nodes.length === 0) return false;

        // Ensure node IDs are unique within the workflow
        const nodeIds = nodes.map(node => node.id);
        return new Set(nodeIds).size === nodeIds.length;
      },
      message: 'Node IDs must be unique within the workflow'
    }
  },
  transitions: {
    type: [TransitionSchema],
    default: [],
    validate: {
      validator: function (transitions: ITransition[]) {
        // Ensure transition IDs are unique
        const transitionIds = transitions.map(t => t.id);
        return new Set(transitionIds).size === transitionIds.length;
      },
      message: 'Transition IDs must be unique within the workflow'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft',
    index: true
  },
  version: {
    type: Number,
    default: 1,
    min: 1
  },
  createdBy: {
    type: String,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'workflows'
});

// Indexes for better query performance
WorkflowSchema.index({ name: 1, createdBy: 1 });
WorkflowSchema.index({ status: 1, createdAt: -1 });
WorkflowSchema.index({ tags: 1 });

// Instance Methods
WorkflowSchema.methods.toJSON = function () {
  const workflow = this.toObject();
  workflow.id = workflow._id;
  delete workflow._id;
  delete workflow.__v;
  return workflow;
};

// Static Methods
WorkflowSchema.statics.findByStatus = function (status: string) {
  return this.find({ status }).sort({ updatedAt: -1 });
};

WorkflowSchema.statics.findByCreator = function (createdBy: string) {
  return this.find({ createdBy }).sort({ updatedAt: -1 });
};

// Pre-save middleware for validation
WorkflowSchema.pre('save', function (next) {
  // Validate that all transition references point to existing nodes
  const nodeIds = this.nodes.map(node => node.id);
  const invalidTransitions = this.transitions.filter(
    transition => !nodeIds.includes(transition.from) || !nodeIds.includes(transition.to)
  );

  if (invalidTransitions.length > 0) {
    return next(new Error('All transitions must reference existing nodes'));
  }

  next();
});

// Export the model
export const Workflow = model<IWorkflow>('Workflow', WorkflowSchema);
export default Workflow;