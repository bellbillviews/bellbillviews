import { execSync } from 'child_process';

console.log('Regenerating package-lock.json by running npm install...');
try {
  execSync('npm install', { 
    cwd: '/vercel/share/v0-project', 
    stdio: 'inherit',
    timeout: 120000
  });
  console.log('Done! package-lock.json has been regenerated and dependencies installed.');
} catch (err) {
  console.error('npm install failed:', err.message);
  process.exit(1);
}
