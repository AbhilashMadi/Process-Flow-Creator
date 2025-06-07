import { StatusCodes } from "~resources/status-codes";
import { BaseException } from '~utils/http.exceptions'

// Workflow-specific error types extending BaseException
export class WorkflowError extends BaseException {
  constructor(message: string, statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR, details?: unknown) {
    super(message, statusCode, details);
  }
}

export class WorkflowValidationError extends BaseException {
  constructor(message: string, details?: unknown) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}

export class WorkflowNotFoundError extends BaseException {
  constructor(id: string, details?: unknown) {
    super(`Workflow with id ${id} not found`, StatusCodes.NOT_FOUND, details);
  }
}

export class WorkflowExecutionError extends BaseException {
  constructor(message: string, details?: unknown) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, details);
  }
}

export class WorkflowConflictError extends BaseException {
  constructor(message: string, details?: unknown) {
    super(message, StatusCodes.CONFLICT, details);
  }
}

export class WorkflowUnauthorizedError extends BaseException {
  constructor(message: string = 'Unauthorized access to workflow', details?: unknown) {
    super(message, StatusCodes.UNAUTHORIZED, details);
  }
}

export class WorkflowForbiddenError extends BaseException {
  constructor(message: string = 'Forbidden access to workflow', details?: unknown) {
    super(message, StatusCodes.FORBIDDEN, details);
  }
}

export class WorkflowTemplateError extends BaseException {
  constructor(message: string, statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR, details?: unknown) {
    super(message, statusCode, details);
  }
}

export class WorkflowTemplateNotFoundError extends BaseException {
  constructor(id: string, details?: unknown) {
    super(`Workflow template with id ${id} not found`, StatusCodes.NOT_FOUND, details);
  }
}

export class WorkflowExecutionNotFoundError extends BaseException {
  constructor(id: string, details?: unknown) {
    super(`Workflow execution with id ${id} not found`, StatusCodes.NOT_FOUND, details);
  }
}

export class WorkflowStateError extends BaseException {
  constructor(message: string, details?: unknown) {
    super(message, StatusCodes.CONFLICT, details);
  }
}

export class WorkflowTimeoutError extends BaseException {
  constructor(message: string = 'Workflow execution timeout', details?: unknown) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}