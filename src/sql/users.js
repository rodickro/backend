const insertClient = 'INSERT INTO cliente (nombres, apellidos, dni , telefono ) VALUES (?, ?, ?, ? )';

const showClients = 'SELECT * FROM cliente WHERE 1=1';


//oe gente esto muestra todos los pedidos de un cliente en especifico, se le pasa el id del cliente y te devuelve todos los pedidos que ha hecho ese cliente
const showOrdersByClientId = 'SELECT cl.id_cliente, cl.nombres, ped.id_pedido, car.id_carrito FROM cliente cl INNER JOIN carrito car ON car.id_cliente=cl.id_cliente INNER JOIN pedido ped ON ped.id_carrito = car.id_carrito INNER JOIN facturacion fac ON fac.id_pedido  =  ped.id_pedido WHERE cl.id_cliente = ?;';


//muchavhos esto muesytra todos los productos de un pedido en especifico, se le pasa el id del pedido y te devuelve todos los productos que tiene ese pedido 
const showProductsByOrderId = 'SELECT ped.id_pedido , prod.nombre AS nombre_producto, color.nombre AS color,talla.nombre AS talla,  dcar.cantidad , prod.precio AS precio_unitario, (prod.precio * dcar.cantidad) AS importe, fac.subtotal ,prom.nombre AS tipo_descuento ,(F_verificarPromocion(prod.id_producto, prod.precio) * dcar.cantidad) AS descuento_aplicado fac.igv AS igv ,fac.total FROM pedido ped INNER JOIN carrito car ON ped.id_carrito = car.id_carritoINNER JOIN detallecarrito dcar ON dcar.id_carrito  =  car.id_carritoINNER JOIN productovariante prodvar ON dcar.id_variante = prodvar.id_varianteINNER JOIN producto prod ON prodvar.id_producto = prod.id_productoINNER JOIN facturacion fac ON fac.id_pedido = ped.id_pedidoINNER JOIN color ON prodvar.id_color = color.id_colorINNER JOIN talla ON prodvar.id_talla = talla.id_tallaINNER JOIN productopromocion prodprom ON prodprom.id_producto = prod.id_productoINNER JOIN promocion prom ON prodprom.id_promocion = prom.id_promocion AND prom.estado = "activo" AND CURDATE() BETWEEN prom.fecha_inicio AND prom.fecha_fin WHERE ped.id_pedido = ?;';

export default {
    insertClient,
    showClients,

    showOrdersByClientId,
    showProductsByOrderId
}

