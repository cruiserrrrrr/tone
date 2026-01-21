import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatServiceChatSettingsRolesRolesGuards1768969519433 implements MigrationInterface {
    name = 'AddChatServiceChatSettingsRolesRolesGuards1768969519433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_services" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_c4633ce69474ffb00d1d2734b33" UNIQUE ("name"), CONSTRAINT "PK_d8572c600cc5b7a42ac574c535a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_chat_settings" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "serviceId" integer NOT NULL, "ton" character varying NOT NULL DEFAULT '', "goal" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_fd80da360db9388d35011dd003f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ad0bb18b123f68933d8e2c6506" ON "user_chat_settings" ("userId", "serviceId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'client'`);
        await queryRunner.query(`ALTER TABLE "user_chat_settings" ADD CONSTRAINT "FK_d8c6196c27a9ba587935ff7fa5f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chat_settings" ADD CONSTRAINT "FK_c9c553a54b97103ab0788ea7b98" FOREIGN KEY ("serviceId") REFERENCES "chat_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_chat_settings" DROP CONSTRAINT "FK_c9c553a54b97103ab0788ea7b98"`);
        await queryRunner.query(`ALTER TABLE "user_chat_settings" DROP CONSTRAINT "FK_d8c6196c27a9ba587935ff7fa5f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad0bb18b123f68933d8e2c6506"`);
        await queryRunner.query(`DROP TABLE "user_chat_settings"`);
        await queryRunner.query(`DROP TABLE "chat_services"`);
    }

}
