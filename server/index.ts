// server.js
import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import handler from './handler';

const app = express();
const port = 3001; 
// Middleware
app.use(cors()); 
app.use(json());

// Execute query
app.post('/api/query', (req: any, res: any) => {
  try {
    const { queryName, queryContent } = req.body;
    
    const result = handler({queryName, queryContent});
    console.log(result);  
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



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});