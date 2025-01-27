const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs"); 

const mongoUrl = "mongodb://127.0.0.1:27017"; 
const dbName = "questionsDB";

async function loadData() {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("questions");

    // Check if data already exists
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log("Data already exists in the database. Skipping import.");
      return;
    }

    const questionsPath = path.join(__dirname, "speakx-questions.json"); 
    const questionsData = fs.readFileSync(questionsPath, "utf8");
    const questions = JSON.parse(questionsData);

    const processedQuestions = questions.map((q) => ({
      ...q,
      _id: new ObjectId(q._id.$oid),
      siblingId: q.siblingId ? new ObjectId(q.siblingId.$oid) : null,
    }));

    const result = await collection.insertMany(processedQuestions);
    console.log(`${result.insertedCount} questions inserted successfully`);
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

loadData();
