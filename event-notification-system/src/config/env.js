const required = [
    'PORT',
    'JWT_SECRET',
    'REDIS_HOST',
    'REDIS_PORT',
    'MONGO_URI'
];

required.forEach(key => {
    if (!process.env[key]) {
        throw new Error(`Missing env variable: ${key}`);
    }
});