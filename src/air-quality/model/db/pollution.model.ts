import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'pollution' })
export class Pollution extends Model {
  @Column({ primaryKey: true, allowNull: false })
  id: string;

  @Column({ allowNull: false })
  country: string;

  @Column({ allowNull: false })
  city: string;

  @Column
  ts: string;

  @Column
  aqius: number;

  @Column
  mainus: string;

  @Column
  aqicn: number;

  @Column
  maincn: string;
}
