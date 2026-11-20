
import database from "../database.js";
import queryCar from "../sql/carrito.js";
import reservar from "../utils/createReserva.js";

const INcarritoController = async (req, res) => {

    const { id_variante, cantidad } = req.body;
    const id_cliente = req.user.id_cliente;

    const connection = await database.promise().getConnection();

    try {

        await connection.beginTransaction();

        // 1. Buscar carrito activo del cliente
        const [carritos] = await connection.query(
            queryCar.selectCar,
            [id_cliente]
        );

        let id_carrito;

        // 2. Crear carrito si no existe
        if (carritos.length > 0) {

            id_carrito = carritos[0].id_carrito;

        } else {

            const [resultado] = await connection.query(
                queryCar.insertCar,
                [id_cliente]
            );

            id_carrito = resultado.insertId;
        }

        // 3. Insertar detalle del carrito
        const [detallecarrito] = await connection.query(
            queryCar.insertCarDetail,
            [id_carrito, id_variante, cantidad]
        );

        const id_detallecarrito = detallecarrito.insertId;

        // 4. Crear reserva usando la misma conexión
        const resultadoReserva = await reservar(
            connection,
            id_detallecarrito,
            cantidad
        );

        if (!resultadoReserva.exitoso) {
            throw new Error("No se pudo crear la reserva");
        }

        // 5. Confirmar transacción
        await connection.commit();

        return res.status(201).json({
            message: 'Producto agregado y reservado correctamente',
            id_cliente,
            id_carrito,
            id_detallecarrito,
            id_reserva: resultadoReserva.id_reserva,
            id_variante,
            cantidad
        });

    } catch (error) {

        await connection.rollback();

        console.error("Error al agregar al carrito:", error);

        return res.status(500).json({
            message: error.message || "Error al agregar producto al carrito"
        });

    } finally {

        connection.release();

    }
};


// Mostrar carrito
const OUTcarritoController = async (req, res) => {

    const id_cliente = req.user.id_cliente;

    try {

        const [resultados] = await database.promise().query(
            queryCar.ShowCarrito,
            [id_cliente]
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
};
