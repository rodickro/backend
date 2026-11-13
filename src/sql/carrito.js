const selectCar = 'SELECT id_carrito FROM carrito WHERE id_usuario = ? AND estado = "activo"';

const insertCar = ' INSERT INTO carrito (id_usuario, fecha_creacion, estado) VALUES (?, NOW(), "activo")';

const insertCarDetail = 'INSERT INTO detallecarrito (id_carrito, id_variante, cantidad) VALUES (?, ?, ?)';


const ShowCarrito = ' SELECT cl.id_cliente ,c.id_carrito , pv.id_variante,dc.id_detalle_carrito , p.nombre AS producto , t.nombre AS talla ,  co.nombre  AS color , dc.cantidad, F_verificarPromocion(p.id_producto, p.precio) AS descuentoXUnidad, ((p.precio-F_verificarPromocion(p.id_producto, p.precio)  )*dc.cantidad) AS importe   FROM detallecarrito dc INNER JOIN carrito c ON dc.id_carrito = c.id_carrito INNER JOIN cliente cl ON cl.id_cliente = c.id_cliente INNER JOIN productovariante pv ON dc.id_variante = pv.id_variante INNER JOIN producto p ON p.id_producto = pv.id_producto INNER JOIN talla t ON t.id_talla = pv.id_talla INNER JOIN color co ON co.id_color = pv.id_color WHERE cl.id_cliente = ? ';

export default {
    selectCar,
    insertCar,
    insertCarDetail,
    ShowCarrito
}