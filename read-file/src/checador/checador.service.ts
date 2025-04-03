import { Injectable } from '@nestjs/common';
import { poolPromise } from '../database/database.config';


@Injectable()
export class ChecadorService {
  async findAll(): Promise<Buffer | null> {
    try {
      const pool = await poolPromise;
      if (!pool) {
        throw new Error('Database connection failed');
      }
      const result = await pool.request().query(`SELECT TOP 4 * FROM Table_1 
        WHERE devserialno = 'K98247676' 
        ORDER BY accessdatentime DESC`);//K98247676  K98247674
      
      
      if (result.recordset.length > 0 && result.recordset[0].capturedpicture) {
        
        const buffer = result.recordset;
        return buffer;
      }
  
      return null;
    } catch (err) {
      console.error('SQL error', err);
      throw new Error('Failed to get data');
    }
  }

}
