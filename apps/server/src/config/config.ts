import dotenv from "dotenv";

dotenv.config();

interface Config {
	port: number;
	NODE_ENV: string;
	FRONTEND_URL: string;
	DATABASE_UR?: string;
	RESEND_API_KEY: string;
	RESEND_AUDIENCE_ID: string;
	BETTER_AUTH_URL: string;
	CORS_ORIGIN: string;
}

const config: Config = {
	port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000,
	NODE_ENV: process.env.NODE_ENV || "development",
	FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
	BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	DATABASE_UR: process.env.DATABASE_URL,
	RESEND_API_KEY: process.env.RESEND_API_KEY || "",
	RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID || "",
	CORS_ORIGIN: process.env.CORS_ORIGIN || "",
};

export default config;

export const isDev = config.NODE_ENV === "development";
