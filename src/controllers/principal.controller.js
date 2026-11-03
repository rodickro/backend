
import PrincipalService from "../services/principal.service.js";

const getPrincipal = async (req, res) => {


    try {
        const products = await PrincipalService.callAllProducts();
        res.json(products);

    } catch (error) {

        res.status(500).json({ error: 'Error retrieving products' });
    }
}

export default { getPrincipal };









