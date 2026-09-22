import {validationResult} from "express-validator";
export function validate(req,res,next){const e=validationResult(req);if(!e.isEmpty())return res.status(422).json({success:false,errors:e.array()});next()}
