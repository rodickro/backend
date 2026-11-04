import database from "../database.js";
import queryProducts from "../sql/products.js";

const callAllProducts = async (req, res) => {

    const { categoria, genero, subcategoria, marca } = req.query;

    let selectProductsQuery = queryProducts.selectAllProductsWhitFilter;
    const queryParams = [];


    try {

        if (categoria) {
            selectProductsQuery += ' AND cat.nombre = ?';
            queryParams.push(categoria);
        }
        if (genero) {
            selectProductsQuery += ' AND gen.nombre = ?';
            queryParams.push(genero);

        }
        if (subcategoria) {
            selectProductsQuery += ' AND subcat.nombre = ?';
            queryParams.push(subcategoria);
        }
        if (marca) {
            selectProductsQuery += ' AND ma.nombre = ?';
            queryParams.push(marca);
        }
        const [products] = await database.promise().query(selectProductsQuery, queryParams);
        console.log('Retrieved products:', products);
        res.json(products);

    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Error retrieving products' });
    }
}

export default { callAllProducts };









