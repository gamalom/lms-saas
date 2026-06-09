import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    //must be filled
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    //must be filled
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.ENUM("super-admin", "teacher", "student", "institute"),
    defaultValue: "student",
  })
  declare role: string;
}

export default User;
