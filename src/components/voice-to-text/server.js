const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.assemblyai.com/v2/realtime/token',
      { expires_in: 3600 },
      { headers: { authorization: `${process.env.AAI_KEY}` } }
    );
    const { data } = response;
    res.json(data);
  } catch (error) {
    const { response: { status, data } } = error;
    res.status(status).json(data);
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
