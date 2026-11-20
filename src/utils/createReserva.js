
const sqlCreateReserva = `
    INSERT INTO reserva
    (id_detalle_carrito, cantidad_reservada)
    VALUES (?, ?)
`;

const reservar = async (connection, iddetallecarrito, cantidad) => {

    try {

        const [resultado] = await connection.query(
            sqlCreateReserva,
            [iddetallecarrito, cantidad]
        );

        return {
            exitoso: resultado.affectedRows > 0,
            id_reserva: resultado.insertId
        };

    } catch (error) {

        console.error('Error al crear la reserva:', error);
        throw error;

    }
};

export default reservar;
