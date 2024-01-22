import { Router } from "express";
import { createDocument, deleteDocument, show, index, updateDocument } from "@controllers/documents.controller";

const router = Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', createDocument);
router.patch('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;