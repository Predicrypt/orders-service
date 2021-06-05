import app from './app';
import mongoose from 'mongoose';
import winston from 'winston';
import dotenv from 'dotenv';
import { UserRegisteredListener } from './events/listeners/UserRegisteredListener';
import { natsWrapper } from './natsWrapper';

dotenv.config({ path: './config.env' });
const LOGGER = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' }),
  ],
});

const start = async () => {
  if (!process.env.DATABASE_URI) {
    LOGGER.warn('No DATABASE_URI env variable');
    process.exit();
  }

  if (!process.env.NATS_CLUSTER_ID) {
    
    LOGGER.warn('No DATABASE_URI env variable');
    process.exit();
  }

  if (!process.env.NATS_CLIENT_ID) {
    LOGGER.warn('No DATABASE_URI env variable');
    process.exit();
  }

  if (!process.env.NATS_URL) {
    LOGGER.warn('No DATABASE_URI env variable');
    process.exit();
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    new UserRegisteredListener(natsWrapper.client).listen();
  } catch (err) {
    LOGGER.error(err);
  }

  const PORT = process.env.PORT || 3000;
  const DB = process.env.DATABASE_URI!;

  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('DB connection successfull');
    });

  app.listen(PORT, () => {
    console.info(`Listening on port ${PORT}...`);
  });
};

start();
