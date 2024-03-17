const {Brand, Item, ItemInfo, ItemPhotos} = require('../models/models')
const fs = require('fs')
const path = require('path')
const ApiError = require('../error/ApiError')

class BrandController {
    async create (req,res) {
        const {name} = req.body;
        const brand = await Brand.create({name});
        return res.json(brand);
    }
    async getAll (req,res) {
        const brands = await Brand.findAll();
        return res.json(brands);
    }
    async delete (req,res) {
        const { id } = req.query;
        const brandId = id;
        const items = await Item.findAll({where: {brandId}});
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
        const itemsDestroy = await Item.destroy({where: {brandId},});
        const brand = await Brand.destroy({where: {id},});
        return res.json(brand);
    }
}
module.exports = new BrandController()