import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeOnDeletePlans1769097760055 implements MigrationInterface {
    name = 'AddCascadeOnDeletePlans1769097760055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan_limits" DROP CONSTRAINT "FK_1e1c9d21c61a1e815de9591b2fb"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bc1cd381147462a1c604b425f7a"`);
        await queryRunner.query(`ALTER TABLE "plan_limits" ADD CONSTRAINT "FK_1e1c9d21c61a1e815de9591b2fb" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bc1cd381147462a1c604b425f7a" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bc1cd381147462a1c604b425f7a"`);
        await queryRunner.query(`ALTER TABLE "plan_limits" DROP CONSTRAINT "FK_1e1c9d21c61a1e815de9591b2fb"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bc1cd381147462a1c604b425f7a" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plan_limits" ADD CONSTRAINT "FK_1e1c9d21c61a1e815de9591b2fb" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
