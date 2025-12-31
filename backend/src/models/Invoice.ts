import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Business from './Business';

class Invoice extends Model {
  public id!: number;
  public amount!: number;
  public dueDate!: Date;
  public isPaid!: boolean;
  public tokenURI!: string;
  public businessId!: number;
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tokenURI: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Invoice',
  tableName: 'invoices'
});

Invoice.belongsTo(Business, { foreignKey: 'businessId' });
Business.hasMany(Invoice, { foreignKey: 'businessId' });

export default Invoice;