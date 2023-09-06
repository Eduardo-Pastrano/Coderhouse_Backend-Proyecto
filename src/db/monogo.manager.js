import mongoose from 'mongoose';
import config from '../config/config.js';

export class MongoManager {
    static #instance
    constructor() {
        mongoose.connect(config.mongo_url)
        .then(() => {
            console.log("Connected to the database succesfully.")
        })
        .catch((error) => {
            console.log("There was an error connecting to the database.")
        })
    }

    static start() {
        if(!this.#instance) {
            this.#instance = new MongoManager();
        }
        return this.#instance;
    }
}