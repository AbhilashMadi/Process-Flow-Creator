import { StatusCodes } from '~resources/status-codes'

export abstract class BaseException extends Error {
  readonly statusCode: StatusCodes
  readonly name: string
  readonly details?: unknown

  constructor(message: string, statusCode: StatusCodes, details?: unknown) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.details = details

    Error.captureStackTrace?.(this, this.constructor)
  }
}

export class BadRequestException extends BaseException {
  constructor(message = 'Bad Request', details?: unknown) {
    super(message, StatusCodes.BAD_REQUEST, details)
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, StatusCodes.UNAUTHORIZED, details)
  }
}

export class ForbiddenException extends BaseException {
  constructor(message = 'Forbidden', details?: unknown) {
    super(message, StatusCodes.FORBIDDEN, details)
  }
}

export class NotFoundException extends BaseException {
  constructor(message = 'Not Found', details?: unknown) {
    super(message, StatusCodes.NOT_FOUND, details)
  }
}

export class ConflictException extends BaseException {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, StatusCodes.CONFLICT, details)
  }
}

export class InternalServerErrorException extends BaseException {
  constructor(message = 'Internal Server Error', details?: unknown) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, details)
  }
}