import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserId1784109999999 implements MigrationInterface {
    name = 'UpdateUserId1784109999999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Ensure id is 1 for the existing user
        await queryRunner.query(`UPDATE \`tbl_user\` SET \`id\` = 1 LIMIT 1`);
        // Reset auto increment
        await queryRunner.query(`ALTER TABLE \`tbl_user\` AUTO_INCREMENT = 2`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No down migration needed
    }
}
