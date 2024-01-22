require("dotenv").config();
import { createConnection } from "mysql2/promise";

const config = {
    host:process.env.DB_HOST,
    user:"root",
    password:process.env.DB_PASSWORD,
    database:"minidocs",
}

const createConnection = async () =>{
    return await createConnection(config)
} 

module.exports = {createConnection, config};