import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCtaColumnInPlans1769097350244 implements MigrationInterface {
    name = 'AddCtaColumnInPlans1769097350244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plans" ADD "cta" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "cta"`);
    }

}
