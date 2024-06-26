import ApiError from '../errors/api-error.js';
import TokenService from "../service/token-service.js";

// Обработчик ошибок при авторизации 
export default function (req, res, next){
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            return next(ApiError.UnauthorizedError())
        }
        
        const userData = TokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(ApiError.UnauthorizedError())
        }
        req.user = { ...userData, role: userData.role }; 
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}
