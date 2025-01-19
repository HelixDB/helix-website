import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import handler from './handler';
import { HelixJs } from '@helix/db';
import Handler from './handler';

const app = express();
const port = 3001;

app.use(cors());
app.use(json());

let instances = new Map<string, Handler>();

app.post('/api/query', (req: any, res: any) => {
  try {
    const { queryName, queryContent, id } = req.body;
    let helix = instances.get(id);
    console.log("id", id);
    const result = helix.handle({ queryName, queryContent, id });
    res.json({
      success: true,
      result,
      queryName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error
    });
  }
});

app.post('/api/init', (req: any, res: any) => {
  try {
    const { userID } = req.body;
    console.log("userID", userID);
    instances.set(userID, new Handler(userID));
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error
    });
  }
}
);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});