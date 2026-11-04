import database from "../database.js";
import queryProducts from "../sql/products.js";

const callAllProducts = async () => {

    try {
        const [results] = await database.promise().query(queryProducts.selectAllProducts)

        return results;
    } catch (error) {
        throw new Error(`Error retrieving products in service`);
    }

}


export default {
    callAllProducts
}
