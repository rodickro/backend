import query from "../sql/products.js";
import database from "../database.js";

const detailsController = async (req, res) => {

    const { id_producto } = req.query;

    try {

        const [details] = await database.promise().query(
            query.productoInfo,
            [id_producto]
        );

        res.json(details);

    } catch (error) {

        res.status(500).json({
            message: "Error al obtener los detalles del producto",
            error: error.message
        });

    }
};

export default detailsController;