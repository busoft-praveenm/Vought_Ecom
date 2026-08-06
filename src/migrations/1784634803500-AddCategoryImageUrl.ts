import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryImageUrl1784634803500 implements MigrationInterface {
    name = 'AddCategoryImageUrl1784634803500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_23d7d1344771331471c41396b9\` ON \`tbl_user_profile\``);
        await queryRunner.query(`ALTER TABLE \`tbl_category\` ADD \`image_url\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_category\` DROP COLUMN \`image_url\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_23d7d1344771331471c41396b9\` ON \`tbl_user_profile\` (\`user_id\`)`);
    }

}
