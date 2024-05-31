import { app } from "./app";
import { connectDB } from "./utils/db";

require("dotenv").config();




// create server!
app.listen(4000,() => {
    console.log("Server is connected");
    connectDB()
})