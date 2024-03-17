const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Backet = sequelize.define('backet', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BacketItem = sequelize.define('backet_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
})

const ItemPhotos = sequelize.define('item_photos', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const ItemInfo = sequelize.define('item_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Backet)
Backet.belongsTo(User)

Backet.hasMany(BacketItem)
BacketItem.belongsTo(Backet)

Type.hasMany(Item)
Item.belongsTo(Type)

Brand.hasMany(Item)
Item.belongsTo(Brand)

Item.hasMany(BacketItem)
BacketItem.belongsTo(Item)

Item.hasMany(ItemInfo, {as: 'info'})
ItemInfo.belongsTo(Item)

Item.hasMany(ItemPhotos, {as: 'photos'})
ItemPhotos.belongsTo(Item)

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

module.exports = {
    User,
    Backet,
    BacketItem,
    Item,
    Type,
    Brand,
    ItemInfo,
    ItemPhotos,
    TypeBrand,
}
