import { Router } from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import { me, search, follow, avatar, updateProfile, profileByUsername } from "../controllers/users.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/me", auth, me);
router.patch("/me", auth, updateProfile);
router.get("/search", auth, search);
router.get("/:username/profile", auth, profileByUsername);
router.post("/:id/follow", auth, follow);
router.post("/avatar", auth, upload.single("avatar"), avatar);

export default router;
