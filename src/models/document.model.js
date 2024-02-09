import {createConnection} from '../configs/db.config.js';

class Document{
    constructor({id, title, content, createdBy, createdAt, updatedAt, updatedBy, deleted, deletedAt, deletedBy}){
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.deleted = deleted;
        this.deletedAt = deletedAt;
        this.deletedBy = deletedBy;
    }

    static async findAll(limit, offset){
        const connection = await createConnection();

        let query = "SELECT id, title, content, createdBy, createdAt, updatedAt, updatedBy, deleted, deletedAt, deletedBy FROM documents WHERE deleted = 0";

        if (offset >= 0 && limit) {
            query += ` LIMIT ${offset}, ${limit}`;
        }
        const [documents] = await connection.query(query);
        connection.end();
        return documents;
    }

    static async findById(id){
        const connection = await createConnection();
        const [documents] = await connection.query(`SELECT id, title, content, createdBy, createdAt, updatedAt, updatedBy, deleted, deletedAt, deletedBy FROM documents WHERE id = ${id} AND deleted = 0`);
        connection.end();
        return documents[0];
    }
    

    async create(){
        const connection = await createConnection();
        const createdDate = new Date();
        const [document] = await connection.query(`INSERT INTO documents (title, content, createdBy, createdAt) VALUES (?, ?, ?, ?)`, [this.title, this.content, this.createdBy, createdDate]);
        connection.end();
        return document;
    }

    static async delete(id, deletedBy){
        const connection = await createConnection();
        const deletedDate = new Date();
        const [document] = await connection.query(`UPDATE documents SET deleted = 1, deletedAt = ?, deletedBy = ? WHERE id = ?`, [deletedDate, deletedBy, id]);
        connection.end();
        return document;
    }

    async update(document, id){
        const connection = await createConnection();
        const [updatedDocument] = await connection.query(`UPDATE documents SET ? WHERE id = ?`, [document, id]);
        connection.end();
        return updatedDocument;
    }
}

export default Document;