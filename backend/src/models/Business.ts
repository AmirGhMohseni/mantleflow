import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface BusinessAttributes {
  id: number;
  name: string;
  ownerAddress: string;
}

interface BusinessCreationAttributes extends Optional<BusinessAttributes, 'id'> {}

class Business extends Model<BusinessAttributes, BusinessCreationAttributes> implements BusinessAttributes {
  public id!: number;
  public name!: string;
  public ownerAddress!: string;
}

Business.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: 'Business',
  tableName: 'businesses'
});

export default Business;