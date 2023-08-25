const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'nest_collections',
    password: 'root',
    port: 5432, // 默认 PostgreSQL 端口
});

// 请求地址
const requestUrl = `http://192.168.8.4:8080/inscription/`


async function updateOwner(tokens: any) {
    for await (const token of tokens) {
        const inscriptionId = token['inscription_id']
        const result = await fetch(requestUrl + inscriptionId, { signal: AbortSignal.timeout(30000) })
        const data = await result.json()
        
        const owner = data['owner']
        const updateSql = `UPDATE collection_token SET owner = '${owner}' WHERE inscription_id = '${inscriptionId}'`
        await client.query(updateSql)
    }
}

async function main() {
    await client.connect();

    const { rows } = await client.query('SELECT * FROM collection_token');

    await updateOwner(rows);

    await client.end();
    process.exit();
}

main();