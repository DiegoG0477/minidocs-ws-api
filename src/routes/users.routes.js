import { Router } from "express";
import { index, show, createUser } from "../controllers/documents.controller";

const router = Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', createUser);

export default router;