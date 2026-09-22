import { Router } from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import {
  create,
  feed,
  like,
  comment,
  media
} from "../controllers/posts.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE_MB || 100) * 1024 * 1024,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowed =
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/");

    if (allowed) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  }
});

router.get("/feed", auth, feed);

router.post(
  "/",
  auth,
  upload.array("media", 10),
  create
);

router.post(
  "/:id/like",
  auth,
  like
);

router.post(
  "/:id/comment",
  auth,
  comment
);

router.get(
  "/media/:id",
  media
);

export default router;