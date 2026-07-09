import { connect } from "c:/BackEnd Pm/PMDapper-BackEnd - Pruebas/src/shared/database/mongodb.js"; // Make sure to use the correct path

async function runTest() {
  try {
    const mongodb = await connect();
    const clientName = "Asegurame"; // Put a real client name here or fetch the first client out of Clientes to test.
    
    // Test fetch projects
    const cicd = await mongodb.collection("CICD").find({}, { projection: { client: 1, name: 1 } }).limit(5).toArray();
    console.log("CICD samples:", cicd);
    
    const dev = await mongodb.collection("Proyectos").find({}, { projection: { client: 1, projectName: 1, name: 1 } }).limit(5).toArray();
    console.log("Dev samples:", dev);
    
    const mkt = await mongodb.collection("Mkt").find({}, { projection: { client: 1, name: 1 } }).limit(5).toArray();
    console.log("Mkt samples:", mkt);

    const hostings = await mongodb.collection("Hostings").find({}, { projection: { client: 1, domain: 1 } }).limit(5).toArray();
    console.log("Hosting samples:", hostings);

    const hours = await mongodb.collection("Hours").find().limit(5).toArray();
    console.log("Hours samples:", hours);

  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}
runTest();
