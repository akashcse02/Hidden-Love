import mongoose from "mongoose";let bucket;export const getBucket=()=>bucket||(bucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db,{bucketName:"media"}));
