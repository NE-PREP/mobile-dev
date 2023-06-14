import { unauthorizedResponse } from "../utils/api.response.js"

export default function (req, res, next){
    if(!(req.user.role == "admin")) return unauthorizedResponse("Access denied! You must be an admin to use this route!",res)
    next()
}