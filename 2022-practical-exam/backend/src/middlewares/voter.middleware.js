import { unauthorizedResponse } from "../utils/api.response.js"

export default function (req, res, next){
    if(!(req.user.role == "voter")) return unauthorizedResponse("Access denied! You must be a voter to use this route!",res)
    next()
}