const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const {Item, ItemInfo, ItemPhotos} = require('../models/models')
const ApiError = require('../error/ApiError')

class ItemController {
    async create (req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body;
            let fileName = uuid.v4() + '.jpg';
            const photos = req.files;
            const {preview, photo} = photos;
            preview.mv(path.resolve(__dirname, '..', 'static', fileName));
            const item = await Item.create({name, price, brandId, typeId, img: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i => {
                    ItemInfo.create({
                        title: i.title,
                        description: i.description,
                        itemId: item.id
                    });
                });
            };

            if (photo) {
                photo.forEach(i => {
                    let name = uuid.v4() + '.jpg';
                    i.mv(path.resolve(__dirname, '..', 'static', name));
                    ItemPhotos.create({name, itemId: item.id});
                })
            }

            return res.json(item);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll (req,res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let items;
        if (!brandId && !typeId) {
            items = await Item.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            items = await Item.findAndCountAll({where:{brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            items = await Item.findAndCountAll({where:{typeId}, limit, offset})
        }
        if (brandId && typeId) {
            items = await Item.findAndCountAll({where:{brandId, typeId}, limit, offset})
        }
        return res.json(items)

    }
    async getById (req,res) {
        const {id} = req.params
        const item = await Item.findOne({where:{id}, include: [{model: ItemInfo, as: 'info'}, {model: ItemPhotos, as: 'photos'}]})
        return res.json(item)
    }
    async delete (req,res) {
        const { id } = req.query;
        const itemId = id
        const item = await Item.findOne({where: {id}});
        await ItemInfo.destroy({where: {itemId},});
        const photos = await ItemPhotos.findAll({where: {itemId}});
        for await (let photo of photos) {
            if (photo) {
                fs.unlinkSync(path.resolve(__dirname, '..', 'static', photo.name));
            }
        }
        await ItemPhotos.destroy({where: {itemId},});
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', item.img));
        const itemDelete = await Item.destroy({where: {id},});
        return res.json(itemDelete)
    }
}
module.exports = new ItemController();