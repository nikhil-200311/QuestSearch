const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const mongoUrl = `mongodb+srv://QuestSearch:QuestSearch@cluster0.blinp.mongodb.net/questionsDB?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = "questionsDB";

async function loadData() {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("questions");

    const count = await collection.countDocuments();
    if (count > 0) {
      console.log("Data already exists in the database. Skipping import.");
      return;
    }

    const dataPath = path.join(__dirname, "questions.json");
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    console.log(`Inserting ${data.length} questions into the database...`);
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} questions inserted successfully`);
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

loadData();
