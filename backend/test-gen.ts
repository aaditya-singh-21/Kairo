import { generateCode } from "./services/generation.service";
import * as dotenv from "dotenv";
dotenv.config();

async function run() {
    try {
        const gen = generateCode("Create a simple button", "");
        for await (const chunk of gen) {
            console.log("CHUNK:", chunk);
        }
    } catch (e) {
        console.error("ERROR:", e);
    }
}
run();
