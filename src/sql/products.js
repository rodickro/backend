

const selectAllProductsWhitFilter =
    'SELECT pro.id_producto, pro.nombre, pro.descripcion, pro.precio, pro.estado, cat.nombre AS Categoría, gen.nombre AS Género, subcat.nombre AS Subcategoria, ma.nombre AS Marca FROM producto pro INNER JOIN subcategoria subcat ON subcat.id_subcategoria = pro.id_subcategoria INNER JOIN categoria cat ON subcat.id_categoria = cat.id_categoria INNER JOIN genero gen ON pro.id_genero = gen.id_genero INNER JOIN marca ma ON pro.id_marca = ma.id_marca WHERE 1=1';

export default {
    selectAllProductsWhitFilter
};

