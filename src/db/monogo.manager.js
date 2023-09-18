import mongoose from 'mongoose';
import config from '../config/config.js';
import { logger } from "../utils/logger.js";

export class MongoManager {
    static #instance
    constructor() {
        mongoose.connect(config.mongo_url)
        .then(() => {
            logger.info("Connected to the database succesfully.")
        })
        .catch((error) => {
            logger.error("There was an error connecting to the database.")
        })
    }

    static start() {
        if(!this.#instance) {
            this.#instance = new MongoManager();
        }
        return this.#instance;
    }
}