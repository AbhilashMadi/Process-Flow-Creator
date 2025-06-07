// server/src/models/index.ts
// Central export file for all models

import { IExecutionStep } from "~models/workflow-execution.model";
import { ITemplateVariable } from "~models/workflow-template.model";
import { INode, ITransition } from "~models/workflow.model";

// Workflow Models
export {
  Workflow,
  IWorkflow,
  INode,
  ITransition
} from './workflow.model';

// Workflow Execution Models
export {
  WorkflowExecution,
  IWorkflowExecution,
  IExecutionStep
} from '~models/workflow-execution.model';

// Workflow Template Models
export {
  WorkflowTemplate,
  IWorkflowTemplate,
  ITemplateVariable
} from '~models/workflow-template.model';

// Type definitions for common use cases
export type WorkflowStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
export type NodeType = 'start' | 'task' | 'decision' | 'end';
export type TemplateCategory = 'logistics' | 'manufacturing' | 'fleet' | 'general' | 'custom';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Common interfaces for API responses
export interface WorkflowResponse {
  id: string;
  name: string;
  description?: string;
  nodes: INode[];
  transitions: ITransition[];
  status: WorkflowStatus;
  version: number;
  createdBy?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowExecutionResponse {
  id: string;
  workflowId: string;
  workflowName: string;
  workflowVersion: number;
  status: ExecutionStatus;
  currentNodeId?: string;
  steps: IExecutionStep[];
  startedAt?: Date;
  completedAt?: Date;
  startedBy?: string;
  context?: Record<string, any>;
  priority: Priority;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTemplateResponse {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
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

// Validation schemas (can be used with Zod or similar)
export const createWorkflowSchema = {
  name: { type: 'string', required: true, maxLength: 200 },
  description: { type: 'string', maxLength: 1000 },
  nodes: { type: 'array', required: true, minItems: 1 },
  transitions: { type: 'array', default: [] },
  status: { type: 'string', enum: ['draft', 'active', 'inactive', 'archived'], default: 'draft' },
  tags: { type: 'array', items: { type: 'string', maxLength: 50 } },
  metadata: { type: 'object' }
};

export const createWorkflowExecutionSchema = {
  workflowId: { type: 'string', required: true },
  startedBy: { type: 'string' },
  context: { type: 'object', default: {} },
  priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  tags: { type: 'array', items: { type: 'string', maxLength: 50 } },
  metadata: { type: 'object' }
};

export const createWorkflowTemplateSchema = {
  name: { type: 'string', required: true, maxLength: 200 },
  description: { type: 'string', maxLength: 1000 },
  category: { type: 'string', enum: ['logistics', 'manufacturing', 'fleet', 'general', 'custom'], required: true },
  industry: { type: 'string', maxLength: 100 },
  nodes: { type: 'array', required: true, minItems: 1 },
  transitions: { type: 'array', default: [] },
  isPublic: { type: 'boolean', default: false },
  tags: { type: 'array', items: { type: 'string', maxLength: 50 } },
  variables: { type: 'array', default: [] },
  instructions: { type: 'string', maxLength: 2000 },
  metadata: { type: 'object' }
};

// Error types
export class WorkflowError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'WorkflowError';
  }
}

export class WorkflowValidationError extends WorkflowError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'WorkflowValidationError';
  }
}

export class WorkflowNotFoundError extends WorkflowError {
  constructor(id: string) {
    super(`Workflow with id ${id} not found`, 'NOT_FOUND');
    this.name = 'WorkflowNotFoundError';
  }
}

export class WorkflowExecutionError extends WorkflowError {
  constructor(message: string) {
    super(message, 'EXECUTION_ERROR');
    this.name = 'WorkflowExecutionError';
  }
}
