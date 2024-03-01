"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class shortlink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  shortlink.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      origina_url: DataTypes.STRING,
      shortened_url: DataTypes.STRING,
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "projects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      click_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      uuid: DataTypes.STRING,
      created_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "shortlink",
    }
  );
  return shortlink;
};
