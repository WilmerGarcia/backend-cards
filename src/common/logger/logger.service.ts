import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logDir = path.join(process.cwd(), 'logs');
  private logFiles = {
    http: path.join(this.logDir, 'http-requests.log'),
    database: path.join(this.logDir, 'database.log'),
    error: path.join(this.logDir, 'error.log'),
  };

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    Object.values(this.logFiles).forEach((file) => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '');
      }
    });
  }

  log(message: string, type: 'http' | 'database' | 'error' = 'http') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    const logFile = this.logFiles[type as keyof typeof this.logFiles];

    if (!logFile) {
      console.error(`Invalid log type: ${type}`);
      return;
    }

    try {
      fs.appendFileSync(logFile, logMessage);
    } catch (error) {
      console.error(`Error writing to ${logFile}:`, error);
    }
  }
}
