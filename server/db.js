import mongoose from 'mongoose';

const Logger = mongoose.mongo.Logger;

const MONGO_URI = 'mongodb://localhost/shop';

mongoose.connect(MONGO_URI);

let logCount = 0;

Logger.setCurrentLogger((msg) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
});

Logger.setLevel('debug');
Logger.filter('class', ['Cursor']);

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useMongoClient: true });
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab instance.'))
    .on('error', error => console.log('Error connecting to MongoLab:', error));

const db = mongoose;
export { MONGO_URI, db };
