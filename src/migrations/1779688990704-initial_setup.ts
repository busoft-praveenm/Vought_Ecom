import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1779688990704 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE tbl_user (
                id BIGINT PRIMARY KEY AUTO_INCREMENT,
                user_uid VARCHAR(255) NOT NULL UNIQUE,
                firebase_uid VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                role VARCHAR(50) DEFAULT 'USER',
                status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE tbl_user;`);
    }
}
