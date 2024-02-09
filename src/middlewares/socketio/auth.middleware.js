// import jwt from 'jsonwebtoken';
// const { verify } = jwt;
import * as jwt from 'jsonwebtoken'
const secretJWT = process.env.SECRET_JWT;

const verifyJWT = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        /**
        En el cliente:
        const socket = io("http://localhost:3000", {
            auth: {
                token: "tokenGeneradoEnLogin"
            }
        });
        */
        
        jwt.verify(token, secretJWT, (err, decode) => {
            if (err) {
                next(err);
            }

            socket.user = decode;
            next();
        });
    } catch (error) {  
        next(error);
    }
}

export { verifyJWT as socketioAuthMiddleware }