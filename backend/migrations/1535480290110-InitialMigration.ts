import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1535480290110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "candle" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timespan" varchar NOT NULL, "open" integer NOT NULL, "close" integer NOT NULL, "high" integer NOT NULL, "low" integer NOT NULL, "datetime" datetime NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "tick" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "symbol" varchar NOT NULL, "ask" integer NOT NULL, "bid" integer NOT NULL, "last" integer NOT NULL, "volume" integer NOT NULL, "main_volume" bigint NOT NULL, "timestamp" datetime NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "tick"`);
        await queryRunner.query(`DROP TABLE "candle"`);
    }

}
