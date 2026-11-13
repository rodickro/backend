import database from "../database.js";

const sqlCreateReserva = `
    INSERT INTO reserva
    (id_detalle_carrito, cantidad_reservada)
    VALUES (?, ?)
`;

const reservar = async (iddetallecarrito, cantidad) => {
    try {

        const [resultado] = await database.promise().query(
            sqlCreateReserva,
            [iddetallecarrito, cantidad]
        );

        return resultado.affectedRows > 0;

    } catch (error) {

        console.error('Error al crear la reserva:', error);
        return false;

    }
};

export default reservar;