const { execSync } = require('child_process');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

console.log('Running prisma db push with injected parameters...');
try {
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
} catch (e) {
    console.error('Push failed');
}
