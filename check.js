const { MongoClient } = require('mongodb');
async function run() {
  try {
    const client = new MongoClient('mongodb+srv://developeragile:vJd5AARoYw82I7Tq@cluster0.pftm9.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    const db = client.db('test');
    
    console.log("== PROYECTOS ==");
    const sampleProject = await db.collection('Proyectos').findOne({ isDeleted: { $ne: true } });
    console.log(sampleProject);
    
    console.log("\n== CICD ==");
    const sampleCicd = await db.collection('CICD').findOne({ isDeleted: { $ne: true } });
    console.log(sampleCicd);

    console.log("\n== MKT ==");
    const sampleMkt = await db.collection('Mkt').findOne({ isDeleted: { $ne: true } });
    console.log(sampleMkt);

    console.log("\n== HOURS ==");
    const sampleHours = await db.collection('Hours').find({ isDeleted: { $ne: true } }).limit(2).toArray();
    console.log(sampleHours);

    await client.close();
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
