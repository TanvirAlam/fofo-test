import { ServerConfig } from '@/types';
import dotenv from 'dotenv';

dotenv.config();

const config : ServerConfig = {
  port: parseInt(process.env.PORT || '3050', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
