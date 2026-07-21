import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

async function startServer() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
}

startServer();
