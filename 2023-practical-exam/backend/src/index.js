import express,{json} from "express"
import { config } from "dotenv";
config({ path: "./.env" });
import "./utils/database.js"
import cors from "cors";
import { corsFunction } from "./utils/cors.js";
import purchasedTokenRoutes from "./routes/purchasedTokens.routes.js"
import { createRequire } from "module";
import swaggerUi from 'swagger-ui-express';

const require = createRequire(import.meta.url);
const swaggerJson = require("../swagger.json");
const app = express();

app.use(cors());
app.use(corsFunction);
app.use(json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use("/purchased-tokens",purchasedTokenRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`);
})