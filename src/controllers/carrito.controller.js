
import database from "../database.js";
import queryCar from '../sql/carrito.js';
import reservar from "../utils/createReserva.js";

const INcarritoController = async (req, res) => {

    const { id_variante, cantidad } = req.body;
    const id_cliente = req.user.id_cliente;

    const db = database.promise();

    try {

        await db.beginTransaction();

        const [carritos] = await db.query(
            queryCar.selectCar,
            [id_cliente]
        );

        let id_carrito;

        if (carritos.length > 0) {

            id_carrito = carritos[0].id_carrito;

        } else {

            const [resultado] = await db.query(
                queryCar.insertCar,
                [id_cliente]
            );

            id_carrito = resultado.insertId;
        }


        const [detallecarrito] = await db.query(
            queryCar.insertCarDetail,
            [id_carrito, id_variante, cantidad]
        );

        const id_detallecarrito = detallecarrito.insertId;


        const resultadoReserva = await reservar(
            id_detallecarrito,
            cantidad
        );

        if (!resultadoReserva.exitoso) {
            throw new Error('No se pudo crear la reserva');
        }

        console.log('Reserva creada:', resultadoReserva.id_reserva);

        await db.commit();

        return res.status(201).json({
            message: 'Producto agregado y reservado correctamente',
            id_carrito,
            id_detallecarrito,
            id_reserva: resultadoReserva.id_reserva,
            id_variante,
            cantidad
        });

    } catch (error) {

        await db.rollback();

        console.error(error);

        return res.status(500).json({
            message: error.message || 'Error al agregar producto al carrito'
        });
    }
};




const OUTcarritoController = async (req, res) => {

    const IDcliente = req.user.id_cliente;

    try {

        const [resultados] = await database.promise().query(
            queryCar.ShowCarrito,
            [IDcliente]
        );

        return res.status(200).json({
            productos: resultados
        });

    } catch (error) {

        console.error("Error al mostrar el carrito:", error);

        return res.status(500).json({
            message: "No se pudo mostrar el carrito"
        });

    }
};

export default {
    INcarritoController,
    OUTcarritoController
}
