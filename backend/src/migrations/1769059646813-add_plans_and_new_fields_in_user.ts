import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlansAndNewFieldsInUser1769059646813 implements MigrationInterface {
    name = 'AddPlansAndNewFieldsInUser1769059646813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plan_limits" ("id" SERIAL NOT NULL, "requests_limit" integer NOT NULL, "context_length" character varying NOT NULL, "priority_level" integer NOT NULL, "max_speed" boolean NOT NULL DEFAULT false, "custom_instructions_enabled" boolean NOT NULL DEFAULT false, "all_tones_unlocked" boolean NOT NULL DEFAULT false, "plan_id" integer NOT NULL, CONSTRAINT "REL_1e1c9d21c61a1e815de9591b2f" UNIQUE ("plan_id"), CONSTRAINT "PK_7e1766a42b4f6a5d98a04eb4ba9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan_features" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, "icon" character varying, "order_index" integer NOT NULL DEFAULT '0', "plan_id" integer NOT NULL, CONSTRAINT "PK_eb2b32d1d93a8b2e96e122e3a77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plans" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "price_usd" numeric(10,2) NOT NULL, "duration_days" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_95f7ef3fc4c31a3545b4d825dd4" UNIQUE ("code"), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "plan_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "requests_left" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "plan_expires_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "plan_purchased_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "plan_limits" ADD CONSTRAINT "FK_1e1c9d21c61a1e815de9591b2fb" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_features" ADD CONSTRAINT "FK_b51952483b18fa15334d714a838" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bc1cd381147462a1c604b425f7a" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bc1cd381147462a1c604b425f7a"`);
        await queryRunner.query(`ALTER TABLE "plan_features" DROP CONSTRAINT "FK_b51952483b18fa15334d714a838"`);
        await queryRunner.query(`ALTER TABLE "plan_limits" DROP CONSTRAINT "FK_1e1c9d21c61a1e815de9591b2fb"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "plan_purchased_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "plan_expires_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "requests_left"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "plan_id"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TABLE "plan_features"`);
        await queryRunner.query(`DROP TABLE "plan_limits"`);
    }

}
