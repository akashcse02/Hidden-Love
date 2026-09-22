import jwt from"jsonwebtoken";export function socketAuth(s,n){try{s.userId=jwt.verify(s.handshake.auth?.token,process.env.JWT_SECRET).userId;n()}catch{n(new Error("Invalid socket token"))}}
