import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
const secretJWT = process.env.SECRET_JWT;
import User from '../models/user.model.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    const userFound = await User.getByEmail({ email });

    if (!userFound) {
        return res.status(401).json({
            message: "email o contraseña incorrecta"
        });
    }

    const isCorrectPass = bcrypt.compareSync(password, userFound.password)

    if (!isCorrectPass) {
        return res.status(401).json({
            message: "email o contraseña incorrecta"
        });
    }

    const payload = {
        user: {
            id: userFound.id
        }
    }

    const token = jwt.sign(payload, secretJWT, { expiresIn: '5h' });

    return res.status(200).json({
        message: "acceso concedido",
        token
    });
}