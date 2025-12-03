const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const replicaApp= process.env.APP_NAME;
const mongoAdmin= fs.readFileSync(process.env.MONGO_DB_USERNAME,'utf8').trim();
const mongoPassword= fs.readFileSync(process.env.MONGO_DB_PWD,'utf8').trim();
const mongoUrlDocker = `mongodb://${mongoAdmin}:${mongoPassword}@mongo:27017/?authSource=admin`;
console.log(mongoUrlDocker);
let client;
let db;

// Retry connection function
const connectWithRetry = async () => {
  let connected = false;
  while (!connected) {
    try {
      client = await MongoClient.connect(mongoUrlDocker, { useNewUrlParser: true, useUnifiedTopology: true });
      db = client.db("user-account");
      console.log("Mongo connected");
      connected = true;
    } catch (err) {
      console.log("Mongo not ready yet, retrying in 2s...");
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

// Connect at app startup
connectWithRetry();

app.post('/update-profile', async (req, res) => {
  try {
    const userObj = req.body;
    userObj.userid = 1;

    await db.collection("users").updateOne(
      { userid: 1 },
      { $set: userObj },
      { upsert: true }
    );

    res.send(userObj);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "DB error" });
  }
});

app.get('/get-profile', async (req, res) => {
  try {
    const result = await db.collection("users").findOne({ userid: 1 });
    res.send(result || {});
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "DB error" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
  console.log(`request served by ${replicaApp}`)
});

app.get('/profile-picture', (req, res) => {
  const img = fs.readFileSync(path.join(__dirname, "images/messi.png"));
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(img, 'binary');
});

app.listen(3000, () => console.log(`${replicaApp} App listening on port 3000`));