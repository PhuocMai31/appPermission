import jwt from 'jsonwebtoken';
import cookie from 'cookie'

export const auth = async (req,res,next) => {
    try {
        var cookies = cookie.parse(req.headers.cookie || '');
        let accessToken = cookies.name;
        console.log(accessToken)
        // let accessToken = req.body["access_token"];
        if(accessToken){
            console.log(111)
            jwt.verify(accessToken, "123456789", (err,decoded) => {
                if (err){
                    return res.status(401).json({
                        message: err.message,
                        status: 401
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            return res.status(401).json({
                message: 'No token provided',
                status: 401
            })
        }
    } catch (err){
        return res.status(401).json({
            message: err.message,
            status: 401
        })
    }
}