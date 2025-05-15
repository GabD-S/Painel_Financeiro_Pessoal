// services/btcService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAll = async () => {
    return await prisma.btc_compras.findMany({ orderBy: { data: "desc" } });
};

const addCompra = async ({ data, quantidade, preco }) => {
    return await prisma.btc_compras.create({
        data: {
            data: new Date(data),
            quantidade,
            preco
        }
    });
};

const deleteCompra = async (id) => {
    return await prisma.btc_compras.delete({
        where: { id: Number(id) }
    });
};

module.exports = { getAll, addCompra, deleteCompra };
