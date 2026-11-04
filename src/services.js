
import con from './database.js';
import bcrypt from 'bcryptjs';

const db = con.promise();

// Registrar un nuevo cliente

export async function registrarCliente(datos) {
    const { correo, contraseña } = datos ?? {};

    // Validar campos obligatorios
    if (
        typeof correo !== 'string' ||
        !correo.trim() ||
        typeof contraseña !== 'string' ||
        !contraseña
    ) {
        throw new Error('Todos los campos son obligatorios');
    }

    if (
        contraseña.length < 8 ||
        Buffer.byteLength(contraseña, 'utf8') > 72
    ) {
        throw new Error('La contraseña debe tener entre 8 y 72 bytes');
    }

    const correoNormalizado = correo.trim().toLowerCase();

    // Buscar el rol Cliente
    const [roles] = await db.execute(
        'SELECT id_rol FROM rol WHERE nombre = ? LIMIT 1',
        ['Cliente']
    );

    if (roles.length === 0) {
        throw new Error('No existe el rol Cliente en la base de datos');
    }

    // Cifrar la contraseña
    const passwordHash = await bcrypt.hash(contraseña, 12);

    // Registrar en la tabla usuario
    const [resultado] = await db.execute(
        `INSERT INTO usuario (id_rol, correo, \`contraseña\`)
         VALUES (?, ?, ?)`,
        [roles[0].id_rol, correoNormalizado, passwordHash]
    );

    return {
        id_usuario: resultado.insertId,
        correo: correoNormalizado
    };
}

export async function iniciarSesion(datos) {
    const { correo, contraseña } = datos ?? {};

    // Validar los campos obligatorios
    if (
        typeof correo !== 'string' ||
        typeof contraseña !== 'string' ||
        !correo.trim() ||
        !contraseña
    ) {
        throw new Error('Correo y contraseña obligatorios');
    }

    // Buscar al usuario activo por su correo
    const [usuarios] = await db.execute(
        `SELECT id_usuario, correo, \`contraseña\`
         FROM usuario
         WHERE correo = ? AND estado = 'activo'
         LIMIT 1`,
        [correo.trim().toLowerCase()]
    );

    if (usuarios.length === 0) {
        throw new Error('Credenciales incorrectas');
    }

    const usuario = usuarios[0];

    // Verificar la contraseña cifrada
    const passwordValida = await bcrypt.compare(
        contraseña,
        usuario['contraseña']
    );

    if (!passwordValida) {
        throw new Error('Credenciales incorrectas');
    }
    return {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo
    };
}

