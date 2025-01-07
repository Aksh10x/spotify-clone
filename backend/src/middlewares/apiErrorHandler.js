import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

async function errorHandler(err,req,res,next) {
    if(err instanceof ApiError){
        res.status(err.statusCode).json(
            new ApiResponse(err.statusCode,null,err.message,false)
        )
    }
    return next();
}

export default errorHandler;