import { Injectable } from '@nestjs/common';
import { createReadStream, mkdirSync, existsSync, writeFileSync } from 'fs';
import * as readline from 'readline';
import * as path from 'path';

@Injectable()
export class AppService {
  async getHello(filePath: string) {
    console.log(filePath)
    try {
      const rl = readline.createInterface({
        input: createReadStream(filePath),
        crlfDelay: Infinity
      });
  
      const lines: string[] = [];
      let i = 0;
      for await (const line of rl) {
        let verificaLinea = line.substring(0, 2);
        let row = line.substring(0, 55);
        
  
        if(verificaLinea === 'M1'){
          let row = line.substring(0, 55);
          let restoRow = line.substring(55, line.length);
          let modifiedLine = row.padEnd(65, ' ');
          let newRow = `${modifiedLine}${restoRow}`;
          lines.push(newRow);
        }else{
          lines.push(line);
        }
  
      }
      
      const outputDir = path.join(__dirname, '../nuevos txt');
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
      }
      const outputFilePath = path.join(outputDir, 'output.txt');
      writeFileSync(outputFilePath, lines.join('\n'));

      return lines;
    } catch (error) {
      console.log(error);
      
    }
    

    
  }
}
