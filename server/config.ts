export const config = {
    elasticsearch: {
        node: 'https://localhost:9200',
        auth: {
            username: 'assignment',
            password: 'assignment',
        },
        tls: {
            rejectUnauthorized: false, // Disable SSL validation in development
        },
    },
    indexName: 'elastic-assignment'
};
