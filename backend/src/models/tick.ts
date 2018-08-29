import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity()
export default class Tick {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    symbol: string;

    @Column('int')
    ask: number;

    @Column('int')
    bid: number;

    @Column('int')
    last: number;

    @Column('int')
    volume: number;

    @Column('bigint')
    main_volume: number;

    @Column('datetime')
    timestamp: Date;
}
