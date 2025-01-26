const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { MongoClient } = require("mongodb");

const PROTO_PATH = __dirname + "/../proto/search.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const searchProto = grpc.loadPackageDefinition(packageDefinition).search;

const mongoUrl = `mongodb+srv://QuestSearch:QuestSearch@cluster0.blinp.mongodb.net/questionsDB?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = "questionsDB";

let questionsCollection

async function connectToMongo() {
  const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log("Connected successfully to MongoDB Atlas")
    const db = client.db(dbName)
    questionsCollection = db.collection("questions")
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error)
    process.exit(1)
  }
}

async function search(call, callback) {
  const { query, page, pageSize } = call.request
  const skip = (page - 1) * pageSize

  try {
    if (!query.trim() || query.length < 5) {
      callback(null, { questions: [], totalResults: 0 })
      return
    }

    const totalResults = await questionsCollection.countDocuments({ title: { $regex: query, $options: "i" } })
    const questions = await questionsCollection
      .find({ title: { $regex: query, $options: "i" } })
      .skip(skip)
      .limit(pageSize)
      .toArray()

    const response = {
      questions: questions.map((q) => ({
        id: q._id.toString(),
        type: q.type || "Unknown",
        title: q.title || "No title",
        options: q.options || [],
        correctAnswer: q.correctAnswer || "Not specified",
      })),
      totalResults,
    }

    console.log("Backend Response:", JSON.stringify(response, null, 2)) 

    callback(null, response)
  } catch (error) {
    console.error("Search error:", error)
    callback(error)
  }
}

function main() {
  const server = new grpc.Server()
  server.addService(searchProto.SearchService.service, { Search: search })
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Server running at http://0.0.0.0:${port}`)
    server.start()
  })
}

connectToMongo().then(main)
