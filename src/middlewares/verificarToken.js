import jwt from 'jsonwebtoken';

const verificarToken = (req, res, next) => {

    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            mensaje: 'Token no proporcionado'
        });
    }

    const token = authorization.split(' ')[1];

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = usuario;

        next();

    } catch (error) {

        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};

export default verificarToken;