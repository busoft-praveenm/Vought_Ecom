import { MigrationInterface, QueryRunner } from "typeorm";

export class OrdersTable1785155757797 implements MigrationInterface {
    name = 'OrdersTable1785155757797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tbl_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`subtotal\` decimal(10,2) NOT NULL DEFAULT '0.00', \`tax\` decimal(10,2) NOT NULL DEFAULT '0.00', \`total\` decimal(10,2) NOT NULL DEFAULT '0.00', \`status\` enum ('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING', \`razorpay_order_id\` varchar(255) NULL, \`razorpay_payment_id\` varchar(255) NULL, \`razorpay_signature\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tbl_order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '1', \`price\` decimal(10,2) NOT NULL, \`order_id\` int NULL, \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` ADD CONSTRAINT \`FK_fe6c3c34cfa2c9e62e3e663941b\` FOREIGN KEY (\`user_id\`) REFERENCES \`tbl_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_order_items\` ADD CONSTRAINT \`FK_dd1b089451faa59efd258d3f488\` FOREIGN KEY (\`order_id\`) REFERENCES \`tbl_order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tbl_order_items\` ADD CONSTRAINT \`FK_84f77f36051f14ac6fd97b9ab51\` FOREIGN KEY (\`product_id\`) REFERENCES \`tbl_products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tbl_order_items\` DROP FOREIGN KEY \`FK_84f77f36051f14ac6fd97b9ab51\``);
        await queryRunner.query(`ALTER TABLE \`tbl_order_items\` DROP FOREIGN KEY \`FK_dd1b089451faa59efd258d3f488\``);
        await queryRunner.query(`ALTER TABLE \`tbl_order\` DROP FOREIGN KEY \`FK_fe6c3c34cfa2c9e62e3e663941b\``);
        await queryRunner.query(`DROP TABLE \`tbl_order_items\``);
        await queryRunner.query(`DROP TABLE \`tbl_order\``);
    }

}
