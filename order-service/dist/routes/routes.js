"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
const OrderController_1 = require("./../infrastructure/rest-api/controllers/OrderController");
const models = {};
const validationService = new runtime_1.ValidationService(models);
function RegisterRoutes(app) {
    app.get("/orders/:id", ...(0, runtime_1.fetchMiddlewares)(OrderController_1.OrderController), ...(0, runtime_1.fetchMiddlewares)(OrderController_1.OrderController.prototype.getOrderById), function OrderController_getOrderById(request, response, next) {
        const args = {
            id: { in: "path", name: "id", required: true, dataType: "string" },
        };
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
            const controller = new OrderController_1.OrderController();
            const promise = controller.getOrderById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, 200, next);
        }
        catch (err) {
            return next(err);
        }
    });
    function isController(object) {
        return "getHeaders" in object && "getStatus" in object && "setStatus" in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === "function" && data.readable && typeof data._read === "function") {
            response.status(statusCode || 200);
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    function responder(response) {
        return (status, data, headers) => {
            returnHandler(response, status, data, headers);
        };
    }
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case "request":
                    return request;
                case "query":
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, {
                        noImplicitAdditionalProperties: "throw-on-extras",
                    });
                case "queries":
                    return validationService.ValidateParam(args[key], request.query, name, fieldErrors, undefined, {
                        noImplicitAdditionalProperties: "throw-on-extras",
                    });
                case "path":
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, {
                        noImplicitAdditionalProperties: "throw-on-extras",
                    });
                case "header":
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, {
                        noImplicitAdditionalProperties: "throw-on-extras",
                    });
                case "body":
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, {
                        noImplicitAdditionalProperties: "throw-on-extras",
                    });
                case "body-prop":
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, "body.", {
                        noImplicitAdditionalProperties: "throw-on-extras",
                    });
                case "formData":
                    if (args[key].dataType === "file") {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, {
                            noImplicitAdditionalProperties: "throw-on-extras",
                        });
                    }
                    else if (args[key].dataType === "array" && args[key].array.dataType === "file") {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, {
                            noImplicitAdditionalProperties: "throw-on-extras",
                        });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, {
                            noImplicitAdditionalProperties: "throw-on-extras",
                        });
                    }
                case "res":
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, "");
        }
        return values;
    }
}
//# sourceMappingURL=routes.js.map