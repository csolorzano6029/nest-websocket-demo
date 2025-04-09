import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'market', schema: 'business' })
export class MarketEntity {
  @PrimaryGeneratedColumn({ name: 'market_id' })
  id: number;

  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Column({ name: 'status' })
  status: string;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate: Date;
}
