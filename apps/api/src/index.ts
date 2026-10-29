import 'dotenv/config';
import { createApp } from './app.js';
import { port } from './config.js';

createApp().listen(port, () => console.log(`SME-TV API listening on http://localhost:${port}`));
