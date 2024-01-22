import User from '@models/user.model';

const index = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;

        const users = await User.findAll(limit, offset);

        return res.status(200).json({
            success: true,
            users,
            message: "se obtuvieron los usuarios correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener los usuarios",
            error: error.message
        });
    }
}

const show = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.getById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "no se encontró el usuario"
            });
        }

        return res.status(200).json({
            success: true,
            user,
            message: "se obtuvo el usuario correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al obtener el usuario",
            error: error.message
        });
    }
}

const createUser = async (req, res) => {
    try {
        const user = new User({
            ...req.body
        });

        return res.status(201).json({
            success: true,
            user,
            message: "se creó el usuario correctamente"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "ocurrió un error al crear el usuario",
            error: error.message
        });
    }
}

export {
    index,
    show,
    createUser
}