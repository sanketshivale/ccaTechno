const { default: mongoose } = require("mongoose");
const db = process.env.DB_URL;
mongoose.set('strictQuery', true);


exports.dbconnection = ()=>{

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on("connected", () => { console.log("Connected to database") })
mongoose.connection.on("error", (err) => { console.log("Failed to connect to MongoDB" + err); })

}