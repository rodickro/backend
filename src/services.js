
import con from './database.js';
import bcrypt from 'bcryptjs';

const db = con.promise();

// Registrar un nuevo cliente
export async function registrarCliente(datos) {
    const {
        nombres,
        apellidos,
        dni,
        telefono,
        correo,
        password
    } = datos;

    // Verificar los campos obligatorios
    if ([nombres, apellidos, dni, telefono, correo, password]
        .some(valor => typeof valor !== 'string' || !valor.trim())) {
        throw new Error('Todos los campos son obligatorios');
    }

    if (!/^[0-9]{8}$/.test(dni)) {
        throw new Error('El DNI debe tener 8 dígitos');
    }

if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
}

if (Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('La contraseña es demasiado larga');
}

    const correoNormalizado = correo.trim().toLowerCase();

    // Proteger la contraseña antes de guardarla
    const passwordHash = await bcrypt.hash(password, 12);

    // Buscar el rol de cliente
    const [roles] = await db.execute(
        'SELECT id_rol FROM rol WHERE nombre = ? LIMIT 1',
        ['Cliente']
    );

    if (roles.length === 0) {
        throw new Error('No existe el rol Cliente en la base de datos');
    }

    // Registrar usuario y cliente en una transacción
    await db.beginTransaction();

    try {
        const [resultado] = await db.execute(
            `INSERT INTO usuario (id_rol, correo, \`contraseña\`)
             VALUES (?, ?, ?)`,
            [roles[0].id_rol, correoNormalizado, passwordHash]
        );

        await db.execute(
            `INSERT INTO cliente
             (id_usuario, nombres, apellidos, dni, telefono)
             VALUES (?, ?, ?, ?, ?)`,
            [
                resultado.insertId,
                nombres.trim(),
                apellidos.trim(),
                dni.trim(),
                telefono.trim()
            ]
        );

        await db.commit();

        return {
            id_usuario: resultado.insertId,
            correo: correoNormalizado
        };

    } catch (error) {
        await db.rollback();
        throw error;
    }
}

export async function iniciarSesion(datos) {
    const { correo, password } = datos;

    // Validar que se hayan ingresado ambos campos
    if (
        typeof correo !== 'string' ||
        typeof password !== 'string' ||
        !correo.trim() ||
        !password
    ) {
        throw new Error('Correo y contraseña obligatorios');
    }

    // Buscar un usuario activo por su correo
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

    // Comparar la contraseña con el hash almacenado
    const passwordValida = await bcrypt.compare(
        password,
        usuario['contraseña']
    );

    if (!passwordValida) {
        throw new Error('Credenciales incorrectas');
    }

    // Devolver los datos públicos del usuario
    return {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo
    };
}
