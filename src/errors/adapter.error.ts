export class ApiError extends Error {
  constructor(public readonly errorMessage: string) {
    super();
  }
}

export default ApiError;
