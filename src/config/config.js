import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    db_name: process.env.DB_NAME,
    mongo_user: process.env.MONGO_USER,
    mongo_pass: process.env.MONGO_PASS,
    mongo_url: process.env.MONGO_URL,
    secret_key: process.env.SECRET,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    github_callback_url: process.env.GITHUB_CALLBACK_URL,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS,
}
