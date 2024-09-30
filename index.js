import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse data
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


// Main route for rendering the page without an image and no error on initial load
app.get('/', (req, res) => {
  res.render('index', { imageUrl: null, error: null });
});

// POST route to fetch an image using Axios
app.post('/generate-image', async (req, res) => {
  try {
    const { width, height } = req.body;

    // Validate user input
    if (!width || !height || isNaN(width) || isNaN(height)) {
      return res.render('index', { imageUrl: null, error: 'Please enter valid numbers for width and height.' });
    }

    // Send request to the Picsum API using Axios
    const API_URL = `https://picsum.photos/${width}/${height}`;
    const response = await axios.get(API_URL, { responseType: 'arraybuffer' });
    
    // Convert image buffer to base64 so that it can be displayed
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:${response.headers['content-type']};base64,${base64Image}`;

    // Render the page with the generated image
    res.render('index', { imageUrl, error: null });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.render('index', { imageUrl: null, error: 'Failed to generate image. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
