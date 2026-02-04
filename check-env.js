const fs = require('fs');
const path = require('path');

function checkEnv() {
    const envPath = path.join(process.cwd(), 'apps/web/.env');
    const envLocalPath = path.join(process.cwd(), 'apps/web/.env.local');

    let envContent = '';
    if (fs.existsSync(envPath)) {
        console.log('Found apps/web/.env');
        envContent += fs.readFileSync(envPath, 'utf8') + '\n';
    }
    if (fs.existsSync(envLocalPath)) {
        console.log('Found apps/web/.env.local');
        envContent += fs.readFileSync(envLocalPath, 'utf8') + '\n';
    }

    const vars = {
        AUTH_SECRET: false,
        SUPABASE_URL: false,
        SUPABASE_ANON_KEY: false,
        SUPABASE_SERVICE_ROLE_KEY: false
    };

    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            if (vars.hasOwnProperty(key) && value.length > 0) {
                vars[key] = true;
                if (key === 'AUTH_SECRET' && value.length < 32) {
                    console.log('WARNING: AUTH_SECRET is too short (< 32 chars)');
                    vars[key] = false;
                }
            }
        }
    });

    console.log('Environment Variable Status:');
    console.log(JSON.stringify(vars, null, 2));
}

checkEnv();
