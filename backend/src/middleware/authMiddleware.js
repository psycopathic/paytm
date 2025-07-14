import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Unauthorized"});
    }

    const token = authHeader.split(' ')[1];
    console.log("Token:", token);
    console.log("Secret:", process.env.JWT_SECRET);

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({message:"Unauthorized"});
    }
}

