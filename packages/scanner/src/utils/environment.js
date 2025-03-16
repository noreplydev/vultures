import path from 'path';
import { fileURLToPath } from 'url';

export function getDirname() {
  // Temporarily override the stack trace preparation to get call site objects.
  const originalPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, stack) => stack;

  const err = new Error();
  // Skip this function's frame so that the next one is the caller.
  Error.captureStackTrace(err, getDirname);
  const stack = err.stack;

  // Restore the original stack trace preparation.
  Error.prepareStackTrace = originalPrepareStackTrace;

  // The first element of the stack is the immediate caller.
  const callerFile = stack[0].getFileName();
  return path.dirname(fileURLToPath(callerFile));
}
