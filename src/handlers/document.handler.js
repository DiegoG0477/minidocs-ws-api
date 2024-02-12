import Document from '../models/document.model.js';

export const registerDocumentsHandlers = (io, socket) => {
    const getAllDocuments = async () => {
        try {
            const documents = Document.findAll();

            socket.emit("document:get_all_success", documents);
        } catch (error) {
            const data = {
                message: "ocurrió un error al obtener los documentos",
                error: error.message
            }

            socket.emit("document:get_all_error", data);
        }
    }

    const readDocument = async (documentId) => {
        try {
            const document = await Document.findById(documentId);

            if (!document) {
                socket.emit("document:not_found", "el documento no fue encontrado");
                return
            }

            socket.emit("document:read_success", document);
        } catch (error) {
            const data = {
                message: "ocurrió un error al obtener el documento",
                error: error.message
            }

            socket.emit("document:read_error", data);
        }
    }

    const createDocument = async (payload) => {
        try {
            const document = new Document({...payload, createdBy: socket.user.id});
            await document.save();

            // emite evento al cliente que creó la notificación
            socket.emit("document:create_success", document);

            // emite evento a todos los clientes
            io.emit('document:created', document);
        } catch (error) {
            const data = {
                message: "ocurrió un error al crear el documento",
                error: error.message
            }

            socket.emit("document:create_error", data);
        }
    }

    const updateDocument = async (payload, documentId, socket) => {
        try{
            const status = Document.update(payload, documentId, {updatedBy: socket.user.id});
            socket.emit("document:update_success", status);
        } catch(error){
            const data = {
                message: "ocurrió un error al actualizar el documento",
                error: error.message
            }

            socket.emit("document:update_error", data);
        }
    }

    const renameDocument = async(payload, documentId, socket) => {
        try{
            const socketId = socket.id;
            const status = Document.rename(payload, documentId, socketId);
            socket.emit("document:rename_success", status);
        } catch(error){
            const data = {
                message: "ocurrió un error al renombrar el documento",
                error: error.message
            }

            socket.emit("document:rename_error", data);
        }
    }

    const getContent = async (documentId) => {
        try{
            const content = Document.getContent(documentId);
            socket.emit("document:get_content_success", content);
        } catch(error){
            const data = {
                message: "ocurrió un error al obtener el contenido del documento",
                error: error.message
            }

            socket.emit("document:get_content_error", data);
        }
    }

    const setContent = async (payload, documentId, socket) => {
        try{
            const status = Document.setContent(payload, documentId, socket.user.id);
            socket.emit("document:set_content_success", status);
        } catch(error){
            const data = {
                message: "ocurrió un error al guardar el contenido del documento",
                error: error.message
            }

            socket.emit("document:set_content_error", data);
        }
    }

    //Update content para guardar los cambios en tiempo real en el documento 
    //necesito un dto con unicamente el content del documento -> Listo
    //usando el metodo update, paso el socketId del usuario que modificó 
    //el documento por ultima vez
    //de lado del cliente, los cambios no guardados que serán rescatados
    //por packet buffer será el texto que escriba el usuario en un
    //estado de desconexión

    //se les manda a llamar con un socket.emit desde el cliente
    
    socket.on("document:update", updateDocument);
    socket.on("document:get_all", getAllDocuments);
    socket.on("document:read", readDocument);
    socket.on("document:create", createDocument);
    socket.on("document:rename", renameDocument);
    socket.on("document:get_content", getContent);
    socket.on("document:set_content", setContent);
}