import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../db.js";
import { User } from "./user.js";

const Tweet = sequelize.define(
  "tweet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    underscored: true,
  }
);
Tweet.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    "id",
    "text",
    "created_at",
    "userId",
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.username"), "username"],
    [Sequelize.col("user.url"), "url"],
  ],
  include: {
    model: User,
    attributes: [],
  },
};
const ORDER_DESC = {
  order: [["created_at", "DESC"]],
};

export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsername(username) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

export async function getById(id) {
  return Tweet.findOne({ where: { id }, ...INCLUDE_USER });
}

export async function create(text, userId) {
  return Tweet.create({ text, userId }) //
    .then((data) => this.getById(data.dataValues.id));
}

export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then((tweet) => {
      tweet.text = text;
      return tweet.save();
    });
}

export async function remove(id) {
  return Tweet.findByPk(id) //
    .then((tweet) => {
      tweet.destroy();
    });
}
