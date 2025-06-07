// server/src/models/workflowTemplate.model.ts
import { Schema, model, Document, Types } from 'mongoose';
import { INode, ITransition } from './workflow.model';

// Interface for workflow template
export interface IWorkflowTemplate extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  category: 'logistics' | 'manufacturing' | 'fleet' | 'general' | 'custom';
  industry?: string;
  nodes: INode[];
  transitions: ITransition[];
  isPublic: boolean;
  createdBy?: string;
  usageCount: number;
  rating?: number;
  tags?: string[];
  variables?: ITemplateVariable[];
  instructions?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for template variables
export interface ITemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'select';
  description?: string;
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Template Variable Schema
const TemplateVariableSchema = new Schema<ITemplateVariable>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'date', 'select'],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  required: {
    type: Boolean,
    default: false
  },
  defaultValue: {
    type: Schema.Types.Mixed
  },
  options: [{
    type: String,
    trim: true
  }],
  validation: {
    min: Number,
    max: Number,
    pattern: String
  }
}, {
  _id: false
});

// Node Schema for templates (reusing from workflow.model.ts)
const TemplateNodeSchema = new Schema<INode>({
  id: {
    type: String,
    required: true
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
  _id: false
});

// Transition Schema for templates (reusing from workflow.model.ts)
const TemplateTransitionSchema = new Schema<ITransition>({
  id: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
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

// Main Workflow Template Schema
const WorkflowTemplateSchema = new Schema<IWorkflowTemplate>({
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
  category: {
    type: String,
    enum: ['logistics', 'manufacturing', 'fleet', 'general', 'custom'],
    required: true,
    index: true
  },
  industry: {
    type: String,
    trim: true,
    maxlength: 100,
    index: true
  },
  nodes: {
    type: [TemplateNodeSchema],
    required: true,
    validate: {
      validator: function (nodes: INode[]) {
        if (nodes.length === 0) return false;
        const nodeIds = nodes.map(node => node.id);
        return new Set(nodeIds).size === nodeIds.length;
      },
      message: 'Node IDs must be unique within the template'
    }
  },
  transitions: {
    type: [TemplateTransitionSchema],
    default: []
  },
  isPublic: {
    type: Boolean,
    default: false,
    index: true
  },
  createdBy: {
    type: String,
    index: true
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    index: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  variables: {
    type: [TemplateVariableSchema],
    default: []
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'workflow_templates'
});

// Indexes for better query performance
WorkflowTemplateSchema.index({ name: 1, category: 1 });
WorkflowTemplateSchema.index({ isPublic: 1, category: 1, rating: -1 });
WorkflowTemplateSchema.index({ tags: 1 });
WorkflowTemplateSchema.index({ usageCount: -1 });
WorkflowTemplateSchema.index({ createdBy: 1, createdAt: -1 });

// Instance Methods
WorkflowTemplateSchema.methods.toJSON = function () {
  const template = this.toObject();
  template.id = template._id;
  delete template._id;
  delete template.__v;
  return template;
};

WorkflowTemplateSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  return this.save();
};

WorkflowTemplateSchema.methods.createWorkflowFromTemplate = function (name: string, variables: Record<string, any> = {}) {
  // This method would create a new workflow instance from this template
  // Implementation would involve variable substitution and workflow creation
  const workflowData = {
    name,
    description: this.description,
    nodes: this.nodes.map((node: INode) => ({
      ...node,
      // Apply variable substitution here
      name: this.substituteVariables(node.name, variables),
      data: this.substituteVariables(node.data, variables)
    })),
    transitions: this.transitions,
    status: 'draft',
    metadata: {
      templateId: this._id,
      templateName: this.name,
      variables
    }
  };

  return workflowData;
};

WorkflowTemplateSchema.methods.substituteVariables = function (text: any, variables: Record<string, any>) {
  if (typeof text !== 'string') return text;

  return text.replace(/\{\{(\w+)\}\}/g, (match: string, varName: string) => {
    return variables[varName] || match;
  });
};

// Static Methods
WorkflowTemplateSchema.statics.findByCategory = function (category: string) {
  return this.find({ category, isPublic: true }).sort({ usageCount: -1, rating: -1 });
};

WorkflowTemplateSchema.statics.findPopular = function (limit: number = 10) {
  return this.find({ isPublic: true })
    .sort({ usageCount: -1, rating: -1 })
    .limit(limit);
};

WorkflowTemplateSchema.statics.findByCreator = function (createdBy: string) {
  return this.find({ createdBy }).sort({ updatedAt: -1 });
};

WorkflowTemplateSchema.statics.searchTemplates = function (query: string) {
  return this.find({
    isPublic: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }).sort({ usageCount: -1, rating: -1 });
};

// Pre-save middleware
WorkflowTemplateSchema.pre('save', function (next) {
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
export const WorkflowTemplate = model<IWorkflowTemplate>('WorkflowTemplate', WorkflowTemplateSchema);
export default WorkflowTemplate;