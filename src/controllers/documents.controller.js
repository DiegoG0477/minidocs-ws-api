import Document from '../models/document.model.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import DocumentDto from '../dtos/document.dto.js';

const { verify } = jwt;
const secretJWT = process.env.SECRET_JWT;

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;

        const documents = await Document.findAll(limit, offset);

        return res.status(200).json({
            success: true,
            documents,
            message: "se obtuvieron los documentos correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener los documentos",
            error: error.message
        });
    }
}

const show = async (req, res) => {
    try {
        const id = req.params.id;
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el documento"
            });
        }

        return res.status(200).json({
            success: true,
            document,
            message: "se obtuvo el documento correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener el documento",
            error: error.message
        });
    }
}

const createDocument = async (req, res) => {
    try {
        const document = new Document({
            ...req.body,
            createdBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            document,
            message: "se creó el documento correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al crear el documento",
            error: error.message
        });
    }
}

const deleteDocument = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBy = req.user.id;

        const document = await Document.delete(id, deletedBy);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el documento"
            });
        }

        return res.status(200).json({
            success: true,
            message: "se eliminó el documento correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al eliminar el documento",
            error: error.message
        });
    }
}

const updateDocument = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedBy = req.user.id;
        const document = new Document({
            ...req.body,
            updatedBy
        });

        const updatedDocument = await Document.update(document, id);

        if (!updatedDocument) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el documento"
            });
        }

        return res.status(200).json({
            success: true,
            message: "se actualizó el documento correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al actualizar el documento",
            error: error.message
        });
    }
}

const getDocumentsByUser = async (req, res) => {
    try {
        const userId = await req.user.id;

        const documents = await Document.findByUserId(userId);

        return res.status(200).json({
            success: true,
            documents,
            message: "se obtuvieron los documentos correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener los documentos",
            error: error.message
        });
    }
}


const inviteDocumentNotification = async (req, res) => {
    try {
        const { documentId, invitedBy, invitedUser } = req.body;

        const invitedDocument = await Document.inviteUser(documentId, invitedBy, invitedUser);

        if (!invitedDocument) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el documento"
            });
        }

        return res.status(200).json({
            success: true,
            message: "se invitó al usuario correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al invitar al usuario",
            error: error.message
        });
    }
}

const responseNotification = async (req, res) => {
    try {
        const { notificationId, response, documentId, invitedId } = req.body;

        const responseNotification = await Document.responseNotification(notificationId, response);

        if (!responseNotification) {
            return res.status(404).json({
                success: false,
                message: "no se encontró la notificación"
            });
        }

        if(response === "accept"){
            await Document.addPermissions(documentId, invitedId);

            return res.status(200).json({
                success: true,
                message: "se aceptó la notificación correctamente"
            });
        }

        return res.status(200).json({
            success: true,
            message: "se respondió la notificación correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al responder la notificación",
            error: error.message
        });
    }
}

export {
    index,
    show,
    createDocument,
    deleteDocument,
    updateDocument, 
    inviteDocumentNotification,
    responseNotification,
    getDocumentsByUser
}