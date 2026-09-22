export function errorHandler(err,req,res,next){console.error(err);res.status(err.statusCode||500).json({success:false,message:err.statusCode?err.message:"Internal server error"})}
