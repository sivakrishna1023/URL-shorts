const {getClient}=require('./database')

async function CreateTableUrls() {
       try{
                const client=await getClient();
                const createShortSchemaQuery=`
                        CREATE TABLE IF NOT EXISTS shorts(
                        id SERIAL PRIMARY KEY,
                        fullurl VARCHAR(255) NOT NULL,
                        short VARCHAR(10) NOT NULL DEFAULT substring(md5(random()::text),1,10),
                        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        expiration TIMESTAMP GENERATED ALWAYS AS (createdAt + interval '1 hour') STORED
                        );
                `;
                await client.query(createShortSchemaQuery);
                console.log("Created the Table");
       }catch(error){
        console.log("Error while creating Table", error);
       }
}

module.exports = { CreateTableUrls };