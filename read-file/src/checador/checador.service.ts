import { Injectable } from '@nestjs/common';
import { poolPromise } from '../database/database.config';


@Injectable()
export class ChecadorService {
  async findAll(): Promise<{ registros: any[]; totalTurnoUno: number, totalTurnoDos: number, totalTurnoTres: number } | null> {
    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error('Database connection failed');
      }
      const queryRegistros = await pool.request().query(`SELECT TOP 4 *
        FROM Table_1 
        WHERE devserialno = 'K98247676' 
        ORDER BY accessdatentime DESC`); ///K98247676  K98247674

      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      let queryTotal = '';

      //turno 1
      if (currentHour >= 9 && currentHour <= 15 ) {
        queryTotal = `
          WITH RankedRecords AS (
            SELECT *,
                  ROW_NUMBER() OVER (PARTITION BY EmployeeID ORDER BY accessdatentime DESC) AS RowNum,
                  'Turno 1' AS turno
            FROM Table_1
            WHERE 
              CAST(accessdatentime AS TIME) BETWEEN '09:30:00' AND '15:00:00'
              AND CAST(accessdatentime AS DATE) = CAST(GETDATE() AS DATE)
              AND devserialno = 'K98247676'
          )
          SELECT *
          FROM RankedRecords
          
          ORDER BY accessdatentime DESC
          `;
      }

      //turno 2
      if (currentHour >= 17 && currentHour <= 20 ) {
        queryTotal = `
        WITH RankedRecords AS (
          SELECT *,
                ROW_NUMBER() OVER (PARTITION BY EmployeeID ORDER BY accessdatentime DESC) AS RowNum,
                CASE
                  WHEN CAST(accessdatentime AS TIME) BETWEEN '09:30:00' AND '15:00:00' THEN 'Turno 1'
                  WHEN CAST(accessdatentime AS TIME) BETWEEN '17:30:00' AND '20:00:00' THEN 'Turno 2'
                ELSE 'Sin Turno'
          END AS turno
          FROM Table_1
          WHERE 
            (CAST(accessdatentime AS TIME) BETWEEN '09:30:00' AND '15:00:00'
            OR (CAST(accessdatentime AS TIME) BETWEEN '17:30:00' AND '20:00:00'))
            AND CAST(accessdatentime AS DATE) = CAST(GETDATE() AS DATE)
            AND devserialno = 'K98247676'
        )
        SELECT *
        FROM RankedRecords
        
        ORDER BY accessdatentime DESC
        `;
      }

      //turno 3
      if (currentHour >= 0 && currentHour <= 2 ) {
        queryTotal = `
        WITH RankedRecords AS (
        SELECT *,
              ROW_NUMBER() OVER (PARTITION BY EmployeeID ORDER BY accessdatentime DESC) AS RowNum,
              CASE
                WHEN CAST(accessdatentime AS TIME) BETWEEN '09:30:00' AND '15:00:00' AND CAST(accessdatentime AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE) THEN 'Turno 1'
                WHEN CAST(accessdatentime AS TIME) BETWEEN '17:30:00' AND '20:00:00' AND CAST(accessdatentime AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE) THEN 'Turno 2'
                WHEN CAST(accessdatentime AS TIME) BETWEEN '00:30:00' AND '02:00:00' AND CAST(accessdatentime AS DATE) = CAST(GETDATE() AS DATE) THEN 'Turno 3'
                ELSE 'Sin Turno'
              END AS turno
        FROM Table_1
        WHERE 
          (CAST(accessdatentime AS TIME) BETWEEN '09:30:00' AND '15:00:00' AND CAST(accessdatentime AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE)) -- Turno 1
          OR (CAST(accessdatentime AS TIME) BETWEEN '17:30:00' AND '20:00:00' AND CAST(accessdatentime AS DATE) = CAST(DATEADD(DAY, -1, GETDATE()) AS DATE)) -- Turno 2
          OR (CAST(accessdatentime AS TIME) BETWEEN '00:30:00' AND '02:00:00' AND CAST(accessdatentime AS DATE) = CAST(GETDATE() AS DATE)) -- Turno 3
          AND devserialno = 'K98247676'
      )
      SELECT *
      FROM RankedRecords
      
      ORDER BY accessdatentime DESC;
        `;
      }
      
      
      
      const consultaTotal = await pool.request().query(queryTotal);
      
      let totalTurnoUno = 0;
      let totalTurnoDos = 0;
      let totalTurnoTres = 0;
      if (queryRegistros.recordset.length > 0 && queryRegistros.recordset[0].capturedpicture) {
        
        const registros = queryRegistros.recordset;
        const total = consultaTotal.recordset;
        
        total?.forEach(element => {
          switch (element.turno) {
            case 'Turno 1':
              ++totalTurnoUno;
              break;
            case 'Turno 2':
              ++totalTurnoUno;
              break;
            case 'Turno 3':
              ++totalTurnoUno;
              break;
          
            default:
              break;
          }
        });
        return {registros: registros,
          totalTurnoUno: totalTurnoUno,
          totalTurnoDos:totalTurnoDos,
          totalTurnoTres: totalTurnoTres
        };
      }
  
      return null;
    } catch (err) {
      console.error('SQL error', err);
      throw new Error('Failed to get data');
    }
  }

}
