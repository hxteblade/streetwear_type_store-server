const {BacketItem , Backet} = require('../models/models')
const ApiError = require('../error/ApiError')

class BacketController {
    async addItem (req,res) {
        const {itemId} = req.body;
        const userId = req.user.id;
        const backet = await Backet.findOne({where: {userId}});
        const backetId = backet.id;
        const addItem = await BacketItem.create({backetId, itemId});
        return res.json(addItem);
    }
    async getById (req,res) {
        const userId = req.user.id;
        const backetUser = await Backet.findOne({where: {userId}});
        const backetId = backetUser.id;
        const backetItems = await BacketItem.findAndCountAll({where: {backetId}});
        return res.json(backetItems);
    }
    async getAll (req,res) {
        let {limit, page} = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        const backetsUsers = await Backet.findAll({limit,offset});
        let counter = [];
        for await (let backet of backetsUsers) {
            const items = await BacketItem.findAll({where: {backetId: backet.id}});
            counter.push({backet,item: {...items}});
        }
        return res.json(counter);
    }
    async deleteOneItem (req,res) {
        const { itemId } = req.query;
        const userId = req.user.id;
        const backet = await Backet.findOne({where: {userId}});
        const backetId = backet.id;
        const removeItem = await BacketItem.findOne({where:{backetId, itemId}});
        removeItem.destroy();
        return res.json(1);
    }
    async deleteAllItemById (req,res) {
        const {itemId} = req.query;
        const userId = req.user.id;
        const backet = await Backet.findOne({where: {userId}});
        const backetId = backet.id;
        const removeItem = await BacketItem.destroy({where:{backetId, itemId}});
        return res.json(removeItem);
    }
}
module.exports = new BacketController()