// server/src/models/workflowExecution.model.ts
import { Schema, model, Document, Types } from 'mongoose';

// Interface for workflow execution steps
export interface IExecutionStep {
  nodeId: string;
  nodeName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  assignedTo?: string; // User ID
  duration?: number; // in milliseconds
}

// Interface for workflow execution
export interface IWorkflowExecution extends Document {
  _id: Types.ObjectId;
  workflowId: Types.ObjectId;
  workflowName: string;
  workflowVersion: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
  currentNodeId?: string;
  steps: IExecutionStep[];
  startedAt?: Date;
  completedAt?: Date;
  startedBy?: string; // User ID who started the execution
  context?: Record<string, any>; // Execution context/variables
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Execution Step Schema
const ExecutionStepSchema = new Schema<IExecutionStep>({
  nodeId: {
    type: String,
    required: true
  },
  nodeName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'skipped'],
    default: 'pending',
    index: true
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  input: {
    type: Schema.Types.Mixed,
    default: {}
  },
  output: {
    type: Schema.Types.Mixed,
    default: {}
  },
  error: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    index: true
  },
  duration: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true,
  _id: false
});

// Main Workflow Execution Schema
const WorkflowExecutionSchema = new Schema<IWorkflowExecution>({
  workflowId: {
    type: Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true,
    index: true
  },
  workflowName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  workflowVersion: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled', 'paused'],
    default: 'pending',
    index: true
  },
  currentNodeId: {
    type: String,
    index: true
  },
  steps: {
    type: [ExecutionStepSchema],
    default: []
  },
  startedAt: {
    type: Date,
    index: true
  },
  completedAt: {
    type: Date,
    index: true
  },
  startedBy: {
    type: String,
    index: true
  },
  context: {
    type: Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
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
  collection: 'workflow_executions'
});

// Indexes for better query performance
WorkflowExecutionSchema.index({ workflowId: 1, status: 1 });
WorkflowExecutionSchema.index({ startedBy: 1, createdAt: -1 });
WorkflowExecutionSchema.index({ status: 1, priority: 1, createdAt: -1 });
WorkflowExecutionSchema.index({ 'steps.assignedTo': 1, 'steps.status': 1 });

// Instance Methods
WorkflowExecutionSchema.methods.toJSON = function () {
  const execution = this.toObject();
  execution.id = execution._id;
  delete execution._id;
  delete execution.__v;
  return execution;
};

WorkflowExecutionSchema.methods.getDuration = function () {
  if (this.startedAt && this.completedAt) {
    return this.completedAt.getTime() - this.startedAt.getTime();
  }
  return null;
};

WorkflowExecutionSchema.methods.getCurrentStep = function () {
  return this.steps.find((step: IExecutionStep) => step.nodeId === this.currentNodeId);
};

WorkflowExecutionSchema.methods.getCompletedSteps = function () {
  return this.steps.filter((step: IExecutionStep) => step.status === 'completed');
};

WorkflowExecutionSchema.methods.getPendingSteps = function () {
  return this.steps.filter((step: IExecutionStep) => step.status === 'pending');
};

// Static Methods
WorkflowExecutionSchema.statics.findByWorkflow = function (workflowId: string) {
  return this.find({ workflowId }).sort({ createdAt: -1 });
};

WorkflowExecutionSchema.statics.findByStatus = function (status: string) {
  return this.find({ status }).sort({ createdAt: -1 });
};

WorkflowExecutionSchema.statics.findByUser = function (userId: string) {
  return this.find({ startedBy: userId }).sort({ createdAt: -1 });
};

WorkflowExecutionSchema.statics.findRunningExecutions = function () {
  return this.find({ status: { $in: ['pending', 'running', 'paused'] } })
    .sort({ priority: 1, createdAt: 1 });
};

// Pre-save middleware
WorkflowExecutionSchema.pre('save', function (next) {
  // Auto-set startedAt when status changes to running
  if (this.isModified('status') && this.status === 'running' && !this.startedAt) {
    this.startedAt = new Date();
  }

  // Auto-set completedAt when status changes to completed/failed/cancelled
  if (this.isModified('status') &&
    ['completed', 'failed', 'cancelled'].includes(this.status) &&
    !this.completedAt) {
    this.completedAt = new Date();
  }

  next();
});

// Export the model
export const WorkflowExecution = model<IWorkflowExecution>('WorkflowExecution', WorkflowExecutionSchema);
export default WorkflowExecution;