import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column
} from 'typeorm';

@Entity()
export class Candle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    timespan: string;

    @Column('int')
    open: number;

    @Column('int')
    close: number;

    @Column('int')
    high: number;

    @Column('int')
    low: number;

    @Column('datetime')
    datetime: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

}
