import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCartEntities1784108319443 implements MigrationInterface {
    name = 'AddCartEntities1784108319443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_cart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`user_id\` int NULL, UNIQUE INDEX \`REL_5abc8a772e0c0789c53884adcf\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_cart_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`cart_id\` int NULL, \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_cart\` ADD CONSTRAINT \`FK_5abc8a772e0c0789c53884adcf4\` FOREIGN KEY (\`user_id\`) REFERENCES \`tbl_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_cart_items\` ADD CONSTRAINT \`FK_0ec2dbcb03d0c77bd83d719ee81\` FOREIGN KEY (\`cart_id\`) REFERENCES \`tbl_cart\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_cart_items\` ADD CONSTRAINT \`FK_eb343d34d37a1dff152f8de68be\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_cart_items\` DROP FOREIGN KEY \`FK_eb343d34d37a1dff152f8de68be\``);
        await queryRunner.query(`ALTER TABLE \`tbl_cart_items\` DROP FOREIGN KEY \`FK_0ec2dbcb03d0c77bd83d719ee81\``);
        await queryRunner.query(`ALTER TABLE \`tbl_cart\` DROP FOREIGN KEY \`FK_5abc8a772e0c0789c53884adcf4\``);
        await queryRunner.query(`DROP TABLE \`tbl_cart_items\``);
        await queryRunner.query(`DROP INDEX \`REL_5abc8a772e0c0789c53884adcf\` ON \`tbl_cart\``);
        await queryRunner.query(`DROP TABLE \`tbl_cart\``);
    }

}
