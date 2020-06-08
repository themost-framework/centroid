// MOST Web Framework Centroid for Deno Copyright (c) 2020,
// THEMOST LP All rights reserved BSD-3-Clause license
declare interface HttpErrorDefinition {
    statusCode: number;
    title: string;
    message: string;
}

const HTTP_ERRORS = new Map<string, HttpErrorDefinition>([
    ["E400", {
        statusCode: 400,
        title: "Bad Request",
        message: "The request cannot be fulfilled due to bad syntax."
    }],
    ["E401", {
        statusCode: 401,
        title: "Unauthorized",
        message: "The request was a legal request, but requires user authentication."
    }],
    ["E403", {
        statusCode: 403,
        title: "Forbidden",
        message: "The server understood the request, but is refusing to fulfill it."
    }],
    ["E404", {
        statusCode: 404,
        title: "Not Found",
        message: "The requested resource could not be found but may be available again in the future."
    }],
    ["E405", {
        statusCode: 405,
        title: "Method Not Allowed",
        message: "A request was made of a resource using a request method not supported by that resource."
    }],
    ["E406", {
        statusCode: 406,
        title: "Not Acceptable",
        message: "The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request."
    }],
    ["E407", {
        statusCode: 407,
        title: "Proxy Authentication Required",
        message: "The client must first authenticate itself with the proxy."
    }],
    ["E408", {
        statusCode: 408,
        title: "Request Timeout",
        message: "The server timed out waiting for the request."
    }],
    ["E409", {
        statusCode: 409,
        title: "Conflict",
        message: "The request could not be completed due to a conflict with the current state of the resource."
    }],
    ["E410", {
        statusCode: 410,
        title: "Gone",
        message: "The resource requested is no longer available and will not be available again."
    }],
    ["E411", {
        statusCode: 411,
        title: "Length Required",
        message: "The request did not specify the length of its content, which is required by the requested resource."
    }],
    ["E412", {
        statusCode: 412,
        title: "Precondition Failed",
        message: "The server does not meet one of the preconditions that the requester put on the request."
    }],
    ["E413", {
        statusCode: 413,
        title: "Request Entity Too Large",
        message: "The request is larger than the server is willing or able to process."
    }],
    ["E414", {
        statusCode: 414,
        title: "Request-URI Too Long",
        message: "The URI provided was too long for the server to process."
    }],
    ["E415", {
        statusCode: 415,
        title: "Unsupported Media Type",
        message: "The server is refusing to service the request because the payload is in a format not supported by this method on the target resource."
    }],
    ["E417", {
        statusCode: 417,
        title: "Expectation Failed",
        message: "The server cannot meet the requirements of the Expect request-header field."
    }],
    ["E496", {
        statusCode: 496,
        title: "No Cert",
        message: "The client must provide a certificate to fulfill the request."
    }],
    ["E498", {
        statusCode: 498,
        title: "Token expired",
        message: "Token was expired or is in invalid state."
    }],
    ["E499", {
        statusCode: 499,
        title: "Token required",
        message: "A token is required to fulfill the request."
    }],
    ["E500", {
        statusCode: 500,
        title: "Internal Server Error",
        message: "The server encountered an internal error and was unable to complete your request."
    }],
    ["E501", {
        statusCode: 501,
        title: "Not Implemented",
        message: "The server either does not recognize the request method, or it lacks the ability to fulfil the request."
    }],
    ["E502", {
        statusCode: 502,
        title: "Bad Gateway",
        message: "The server was acting as a gateway or proxy and received an invalid response from the upstream server."
    }],
    [ "E503",  {
        statusCode: 503,
        title: "Service Unavailable",
        message: "The server is currently unavailable (because it is overloaded or down for maintenance)."
    }]
]);

export class HttpError extends Error {
    public code: string = "E500";
    public title?: string;
    public statusCode: number = 500;
    constructor(status: number, message?: string) {
        super();
        this.code = `E${status || 500}`;
        // find error definition 
        let findError = HTTP_ERRORS.get(this.code);
        // assign error properties
        Object.assign(this, findError);
        // and finally set custom message if any
        if (message) {
            this.message = message;
        }
    }
}

export class HttpBadRequestError extends HttpError {
    constructor(message?: string) {
        super(400, message);
    }
}

export class HttpUnauthorizedError extends HttpError {
    constructor(message?: string) {
        super(401, message);
    }
}

export class HttpForbiddenError extends HttpError {
    constructor(message?: string) {
        super(403, message);
    }
}

export class HttpNotFoundError extends HttpError {
    constructor(message?: string) {
        super(404, message);
    }
}

export class HttpMethodNotAllowedError extends HttpError {
    constructor(message?: string) {
        super(405, message);
    }
}

export class HttpNotAcceptableError extends HttpError {
    constructor(message?: string) {
        super(406, message);
    }
}

export class HttpProxyAuthenticationRequiredError extends HttpError {
    constructor(message?: string) {
        super(407, message);
    }
}

export class HttpRequestTimeoutError extends HttpError {
    constructor(message?: string) {
        super(408, message);
    }
}

export class HttpConflictError extends HttpError {
    constructor(message?: string) {
        super(409, message);
    }
}


export class HttpGoneError extends HttpError {
    constructor(message?: string) {
        super(410, message);
    }
}


export class HttpLengthRequiredError extends HttpError {
    constructor(message?: string) {
        super(411, message);
    }
}

export class HttpPreconditionFailedError extends HttpError {
    constructor(message?: string) {
        super(411, message);
    }
}

export class HttpUnsupportedMediaError extends HttpError {
    constructor(message?: string) {
        super(415, message);
    }
}

export class HttpTokenExpiredError extends HttpError {
    constructor(message?: string) {
        super(498, message);
    }
}

export class HttpTokenRequiredError extends HttpError {
    constructor(message?: string) {
        super(499, message);
    }
}

export class HttpServerError extends HttpError {
    constructor(message?: string) {
        super(500, message);
    }
}

export class HttpNotImplementedError extends HttpError {
    constructor(message?: string) {
        super(501, message);
    }
}


export class HttpBadGatewayError extends HttpError {
    constructor(message?: string) {
        super(502, message);
    }
}


export class HttpServiceUnavailableError extends HttpError {
    constructor(message?: string) {
        super(503, message);
    }
}