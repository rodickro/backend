import pool from '../database.js';

export const obtenerCarrito = async (req, res) => {
    try {
        // Se obtiene el id_cliente del token si es que ya se configuró el middleware,
        // de lo contrario, se usa req.query o un valor por defecto (1) para poder probar sin errores.
        const id_cliente = req.user?.id_cliente || req.query.id_cliente || 1;

        
        const query = `
            SELECT 
                c.id_cliente,
                c.id_carrito,
                dc.id_variante,
                dc.id_detalle_carrito,
                p.nombre AS producto,
                t.nombre AS talla,
                co.nombre AS color,
                dc.cantidad,
                0.00 AS descuentoXUnidad, 
                (p.precio * dc.cantidad) AS importe
            FROM carrito c
            INNER JOIN detallecarrito dc ON c.id_carrito = dc.id_carrito
            INNER JOIN productovariante pv ON dc.id_variante = pv.id_variante
            INNER JOIN producto p ON pv.id_producto = p.id_producto
            INNER JOIN talla t ON pv.id_talla = t.id_talla
            INNER JOIN color co ON pv.id_color = co.id_color
            WHERE c.id_cliente = ? AND c.estado = 'activo';
        `;

        const [rows] = await pool.promise().query(query, [id_cliente]);
        
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "Error interno del servidor al procesar el carrito" });
    }
};