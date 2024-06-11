import  ApiError  from "../errors/api-error.js";

// Обработчик критических ошибок на сервере 
export default function (err, req, res, next){
    console.log(err);
    if(err instanceof ApiError){
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: err.message || 'Что-то пошло не так'});
}