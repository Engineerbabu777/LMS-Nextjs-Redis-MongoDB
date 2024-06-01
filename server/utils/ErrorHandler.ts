// Define a custom error handler class that extends the built-in Error class
class ErrorHandler extends Error {
    // Define a property to hold the status code
    statusCode: Number;

    // Constructor to initialize the error message and status code
    constructor(message: any, statusCode: Number) {
        // Call the parent class (Error) constructor with the message
        super(message);

        // Set the statusCode property with the provided status code
        this.statusCode = statusCode;

        // Capture the stack trace (excluding this constructor)
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the ErrorHandler class for use in other modules
export default ErrorHandler;
