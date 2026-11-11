
const selectAllProductsWhitFilter =
    'SELECT pro.nombre, pro.descripcion, pro.precio , pro.estado , cat.nombre AS Categoría , gen.nombre AS Género , subcat.nombre AS Subcategoria, ma.nombre AS Marca FROM producto  pro INNER JOIN subcategoria subcat ON subcat.id_subcategoria = pro.id_subcategoria INNER JOIN categoria cat ON subcat.id_categoria = cat.id_categoria INNER JOIN genero gen ON pro.id_genero = gen.id_genero INNER JOIN marca ma ON pro.id_marca = ma.id_marca WHERE 1=1';




const insertProduct = 'INSERT INTO producto(id_subcategoria,id_marca,id_genero,nombre,descripcion, precio, estado , fecha_registro,iamgen_url) VALUES(?,?,?,?,?,?,?,?,?)';

const alterProductData = 'UPDATE producto SET  ';
const deleteProduct = 'DELETE FROM producto WHERE id_producto = ?';


const productoInfo = 'SELECT cat.nombre AS categoria , scat.nombre AS subcategoria, ge.nombre AS genero, ma.nombre AS marca , pr.nombre, pr.descripcion, pr.precio, pr.estado, pr.imagen_url , tiene_promocion(pr.id_producto) AS Descuento, F_verificarPromocion(pr.id_producto, pr.precio) AS monto_descuento , pr.precio - F_verificarPromocion(pr.id_producto, pr.precio) AS precio_final FROM producto pr INNER JOIN marca ma ON pr.id_marca = ma.id_marca INNER JOIN genero ge ON pr.id_genero = ge.id_genero  INNER JOIN subcategoria scat ON pr.id_subcategoria = scat.id_subcategoria INNER JOIN categoria cat ON scat.id_categoria = cat.id_categoria WHERE id_producto = ?';

export default {
    selectAllProductsWhitFilter,
    deleteProduct,
    insertProduct,
    alterProductData,
    productoInfo
}
