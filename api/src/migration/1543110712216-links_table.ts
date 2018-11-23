import {MigrationInterface, QueryRunner} from "typeorm";

export class linksTable1544158929356 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `link` (`id` int NOT NULL AUTO_INCREMENT, `shortUrl` varchar(100) NOT NULL, `ipAddress` varchar(255) NOT NULL, `destinationUrl` longtext NOT NULL, `hits` int NOT NULL DEFAULT 0, `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_1d305dce96a3565a58fa8a0893` (`shortUrl`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_1d305dce96a3565a58fa8a0893` ON `link`");
        await queryRunner.query("DROP TABLE `link`");
    }

}
