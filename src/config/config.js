import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT,
    db_name: process.env.DB_NAME,
    mongo_user: process.env.MONGO_USER,
    mongo_pass: process.env.MONGO_PASS,
    secret_key: process.env.SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.GITHUB_CALLBACK_URL,
}
