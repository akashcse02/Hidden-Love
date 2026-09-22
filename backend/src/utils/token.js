import jwt from "jsonwebtoken";
export const signToken=id=>jwt.sign({userId:id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||"7d"});
