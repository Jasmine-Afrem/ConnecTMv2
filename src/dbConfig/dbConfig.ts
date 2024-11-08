import mysql from 'mysql2';

// Create a connection object (not yet connected)
const connection = mysql.createConnection(process.env.DATABASECONNECTION!);

// Function to connect to the MySQL database
export async function connect() {
  return new Promise<void>((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database: ', err);
        reject(err); // Reject the promise if the connection fails
      } else {
        console.log('Connected to MySQL database');
        resolve(); // Resolve the promise if the connection is successful
      }
    });
  });
}

// Export the connection for use in other parts of your app
export { connection };
