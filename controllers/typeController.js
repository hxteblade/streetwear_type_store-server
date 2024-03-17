const {Type, Item, ItemInfo} = require('../models/models')
const fs = require('fs')
const ApiError = require('../error/ApiError')

class TypeController {
    async create (req,res) {
        const {name} = req.body;
        const type = await Type.create({name});
        return res.json(type);
    }
    async getAll (req,res) {
        const types = await Type.findAll();
        return res.json(types);
    }
    async delete (req,res) {
        const { id } = req.query;
        const typeId = id;
        const items = await Item.findAll({where: {typeId},})
        for await (let item of items) {
            if (item) {
                const itemId = item.id
                const photos = await ItemPhotos.findAll({where: {itemId}});
                for await (let photo of photos) {
                    if (photo) {
                        fs.unlinkSync(path.resolve(__dirname, '..', 'static', photo.name));
                    }
                }
                await ItemPhotos.destroy({where: {itemId},});
                fs.unlinkSync(path.resolve(__dirname, '..', 'static', item.img))
                await ItemInfo.destroy({where: {itemId},});
            }
        }
        const itemsDestroy = await Item.destroy({where: {typeId},});
        const type = await Type.destroy({where: {id},});
        return res.json(type);
    }
}
module.exports = new TypeController()