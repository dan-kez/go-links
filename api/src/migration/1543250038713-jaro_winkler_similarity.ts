import {MigrationInterface, QueryRunner} from "typeorm";

export class jaroWinklerSimilarity1543250038713 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE FUNCTION jaro_winkler_similarity(
          in1 VARCHAR(255),
          in2 VARCHAR(255)
        )
          RETURNS FLOAT
        DETERMINISTIC
          BEGIN

            DECLARE finestra, curString, curSub, maxSub, trasposizioni, prefixlen, maxPrefix INT;
            DECLARE char1, char2 CHAR(1);
            DECLARE common1, common2, old1, old2 VARCHAR(255);
            DECLARE trovato BOOLEAN;
            DECLARE returnValue, jaro FLOAT;
            SET maxPrefix = 6;

            SET common1 = "";
            SET common2 = "";
            SET finestra = (length(in1) + length(in2) - abs(length(in1) - length(in2))) DIV 4
                           + ((length(in1) + length(in2) - abs(length(in1) - length(in2))) / 2) MOD 2;
            SET old1 = in1;
            SET old2 = in2;


            SET curString = 1;
            WHILE curString <= length(in1) AND (curString <= (length(in2) + finestra)) DO
              SET curSub = curstring - finestra;
              IF (curSub) < 1
              THEN
                SET curSub = 1;
              END IF;
              SET maxSub = curstring + finestra;
              IF (maxSub) > length(in2)
              THEN
                SET maxSub = length(in2);
              END IF;
              SET trovato = FALSE;
              WHILE curSub <= maxSub AND trovato = FALSE DO
                IF substr(in1, curString, 1) = substr(in2, curSub, 1)
                THEN
                  SET common1 = concat(common1, substr(in1, curString, 1));
                  SET in2 = concat(substr(in2, 1, curSub - 1), concat("0", substr(in2, curSub + 1, length(in2) - curSub + 1)));
                  SET trovato = TRUE;
                END IF;
                SET curSub = curSub + 1;
              END WHILE;
              SET curString = curString + 1;
            END WHILE;


            SET in2 = old2;
            SET curString = 1;
            WHILE curString <= length(in2) AND (curString <= (length(in1) + finestra)) DO
              SET curSub = curstring - finestra;
              IF (curSub) < 1
              THEN
                SET curSub = 1;
              END IF;
              SET maxSub = curstring + finestra;
              IF (maxSub) > length(in1)
              THEN
                SET maxSub = length(in1);
              END IF;
              SET trovato = FALSE;
              WHILE curSub <= maxSub AND trovato = FALSE DO
                IF substr(in2, curString, 1) = substr(in1, curSub, 1)
                THEN
                  SET common2 = concat(common2, substr(in2, curString, 1));
                  SET in1 = concat(substr(in1, 1, curSub - 1), concat("0", substr(in1, curSub + 1, length(in1) - curSub + 1)));
                  SET trovato = TRUE;
                END IF;
                SET curSub = curSub + 1;
              END WHILE;
              SET curString = curString + 1;
            END WHILE;

            SET in1 = old1;


            IF length(common1) <> length(common2)
            THEN SET jaro = 0;
            ELSEIF length(common1) = 0 OR length(common2) = 0
              THEN SET jaro = 0;
            ELSE


              SET trasposizioni = 0;
              SET curString = 1;
              WHILE curString <= length(common1) DO
                IF (substr(common1, curString, 1) <> substr(common2, curString, 1))
                THEN
                  SET trasposizioni = trasposizioni + 1;
                END IF;
                SET curString = curString + 1;
              END WHILE;
              SET jaro =
              (
                length(common1) / length(in1) +
                length(common2) / length(in2) +
                (length(common1) - trasposizioni / 2) / length(common1)
              ) / 3;

            END IF;

            SET prefixlen = 0;
            WHILE (substring(in1, prefixlen + 1, 1) = substring(in2, prefixlen + 1, 1)) AND (prefixlen < 6) DO
              SET prefixlen = prefixlen + 1;
            END WHILE;



            RETURN jaro + (prefixlen * 0.1 * (1 - jaro));

          END`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP FUNCTION jaro_winkler_similarity")
    }

}
