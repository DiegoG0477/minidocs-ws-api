import { Router } from "express";
import * as documentsController from "../controllers/documents.controller.js";
import { httpAuthMiddleware } from "../middlewares/http/auth.middleware.js";

const documentsRouter = Router();

documentsRouter.get('/', httpAuthMiddleware, documentsController.index);
documentsRouter.get('/:id', httpAuthMiddleware, documentsController.show);
documentsRouter.post('/', httpAuthMiddleware, documentsController.createDocument);
documentsRouter.patch('/:id', httpAuthMiddleware, documentsController.updateDocument);
documentsRouter.delete('/:id', httpAuthMiddleware, documentsController.deleteDocument);

export default documentsRouter;