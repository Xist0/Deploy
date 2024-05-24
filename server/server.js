import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import multer from 'multer';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { router } from "./router/index.js";
import { sql } from "./db.js";
import RoleModel from './models/role-model.js';
import UserModel from './models/user-model.js';
import TokenSchema from './models/token-model.js';
import errorMiddleware from "./middlewares/error-middleware.js";
import cookieParser from 'cookie-parser';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const port = process.env.PORT || 5000;
const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));


const corsOptions = {
  origin: 'https://94.41.188.23',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use('/api', router);

app.use(errorMiddleware);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


async function createTables() {
  await RoleModel.createRoleTable();
  await UserModel.createUserTable();
  await TokenSchema.createTokenTable();
}
// API доступа к 1C
app.get('/api/:resource', async (req, res) => {
  const { resource } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/${resource}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/order/:limit/:offset', async (req, res) => {
  const { limit, offset } = req.params;
  console.log(limit);
  console.log(offset);

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/order/${limit}/${offset}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/typeofrepaire', async (req, res) => {

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/typeofrepaire`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/audio/:name', async (req, res) => {
  const { name } = req.params;
  const audioUrl = `http://192.168.1.10/static/song/${name}`;
  res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
  try {
    const response = await axios.get(audioUrl, { responseType: 'stream' });
    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
    res.header('Content-Type', 'audio/mpeg');
    res.header('Content-Disposition', `attachment;filename='${name}'`);
    res.header('Content-Length', response.headers['content-length']);
    res.header('Content-Range', `bytes 0-${response.headers['content-length']}/${response.headers['content-length']}`);
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Accept-Ranges", "bytes");
    res.header("Access-Control-Allow-Credentials", "true");
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching audio:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/byt/order/:number', async (req, res) => {
  const { number } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/byt/order/${number}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/byt/order/:searchNumber/:encodedUserRole/:UserName', async (req, res) => {
  const { searchNumber, encodedUserRole, UserName } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(`http://192.168.1.10/api/byt/order/${searchNumber}/${encodedUserRole}/${UserName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/1c/users', async (req, res) => {

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/1c/users`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/1c/users', async (req, res) => {

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/1c/users`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/callstoday/:startDate/:endDate/:searchNumberValue', async (req, res) => {
  const { startDate, endDate, searchNumberValue } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/callstoday/${startDate}/${endDate}/${searchNumberValue}`);

    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/order/record/:day/:name', async (req, res) => {
  const { day, name } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/order/record/${day}/${name}`);

    res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/acceptance/:data/:userRole/:UserName', async (req, res) => {
  const { data, userRole, UserName } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/acceptance/${data}/${userRole}/${UserName}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/shipment/:qrData/:userRole/:userName/:posishion', async (req, res) => {
  const { qrData, userRole, userName, posishion } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/shipment/${qrData}/${userRole}/${userName}/${posishion}`);

    if (!response.ok) {
      const errorMessage = await response.json();
      return res.status(response.status).send(errorMessage);
    }

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/users/search/:l_name', async (req, res) => {
  const { l_name } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');

    const response = await fetch(`http://192.168.1.10/api/users/search/${encodeURIComponent(l_name)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/api/works1c/:Z_name', async (req, res) => {
  const { Z_name } = req.params;

  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(`http://192.168.1.10/api/works1c/${encodeURIComponent(Z_name)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/api/1c/WarrantyOrder', async (req, res) => {
  try {
    const requestData = req.body;

    const response = await fetch('http://192.168.1.10/api/1c/WarrantyOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    const responseData = await response.json();
    console.log('Data received:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});
app.get(`/api/WarrantyOrdermaxvi/:numberMaxvi`, async (req, res) => {
  const { numberMaxvi } = req.params;
  try {
    const response = await fetch(`http://192.168.1.10/api/WarrantyOrdermaxvi/${numberMaxvi}`);
    if (!response.ok) {
      const errorText = await response.text(); // Чтение текста из ответа
      let errorData;
      try {
        errorData = JSON.parse(errorText); // Попытка парсинга текста как JSON
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`External server error! Status: ${response.status}, Message: ${errorText}`);
      }

      const errorMessage = `External server error! Status: ${response.status}, Message: ${errorData.message || errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

// Maxvi
let savedLink = '';
app.post(`/api/GetExternalLinkAndSendData`, async (req, res) => {
  try {
    const { data } = req.body;

    const response1 = await fetch(`http://192.168.1.76:8000/maxvi`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    if (!response1.ok) {
      throw new Error(`HTTP error! Status: ${response1.status}`);
    }

    const link = await response1.text();
    savedLink = link;

    const response2 = await fetch(`${link}/imei`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response2.ok) {
      const errorText = await response.text(); // Чтение текста из ответа
      let errorData;
      try {
        errorData = JSON.parse(errorText); // Попытка парсинга текста как JSON
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`External server error! Status: ${response2.status}, Message: ${errorText}`);
      }

      const errorMessage = `External server error! Status: ${response2.status}, Message: ${errorData.message || errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response2.json();
    res.locals = { ...res.locals, url: link };
    res.json(responseData);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});
app.post(`/api/SendDefectToExternalLink`, async (req, res) => {
  try {
    const { device } = req.body;

    const response = await fetch(`${savedLink}defect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ device })
    });
    if (!response.ok) {
      const errorText = await response.text(); // Чтение текста из ответа
      let errorData;
      try {
        errorData = JSON.parse(errorText); // Попытка парсинга текста как JSON
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`External server error! Status: ${response.status}, Message: ${errorText}`);
      }

      const errorMessage = `External server error! Status: ${response.status}, Message: ${errorData.message || errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    res.locals = { ...res.locals, url: savedLink };
    res.json(responseData);
  } catch (error) {
    console.error('Error sending defect to external link:', error);
    res.status(500).send(error.message || 'Ошибка отправки дефекта на внешнюю ссылку');
  }
});
app.post(`/api/GetAllWorks`, async (req, res) => {
  try {
    const { works } = req.body;

    const response = await fetch(`${savedLink}work`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ works })
    });

    if (!response.ok) {
      const errorText = await response.text(); // Чтение текста из ответа
      let errorData;
      try {
        errorData = JSON.parse(errorText); // Попытка парсинга текста как JSON
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`External server error! Status: ${response.status}, Message: ${errorText}`);
      }

      const errorMessage = `External server error! Status: ${response.status}, Message: ${errorData.message || errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});
app.post(`/api/GetAllParts`, async (req, res) => {
  try {
    const { parts } = req.body;

    const response = await fetch(`${savedLink}part`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parts })
    });
    if (!response.ok) {
      const errorText = await response.text(); // Чтение текста из ответа
      let errorData;
      try {
        errorData = JSON.parse(errorText); // Попытка парсинга текста как JSON
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`External server error! Status: ${response.status}, Message: ${errorText}`);
      }

      const errorMessage = `External server error! Status: ${response.status}, Message: ${errorData.message || errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    res.locals = { ...res.locals, url: savedLink };
    res.json(responseData);
    console.log('Результат Parts', responseData);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});
app.post('/api/SaveAktData', async (req, res) => {
  try {
    const { device, act_issuing_reason } = req.body;

    if (!device) {
      throw new Error('No device data provided');
    }

    const response = await fetch(`${savedLink}act`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ device, act_issuing_reason })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        throw new Error(`External server error! Status: ${response.status}, Message: ${errorText}`);
      }

      const errorMessage = `External server error! Status: ${response.status}, Message: ${errorData.message || errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    const responseData = await response.json();
    console.log('Результат act:', responseData);
    res.locals = { ...res.locals, url: savedLink };
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});
app.post(`/api/Finish`, async (req, res) => {
  try {
    const { formData } = req.body;

    const response = await fetch(`${savedLink}fin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `External server error! Status: ${response.status}, Message: ${errorData.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log('Результат fin:', responseData);
    res.locals = { ...res.locals, url: savedLink };
    res.json(responseData);
    res.status(response.status).json(responseData);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).send(error.message || 'Internal Server Error');
  }
});
app.post('/api/parser/warrantyorder', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).send('No file uploaded or file format is invalid');
    }
    const fileBytes = req.file.buffer;
    const response = await axios.post('http://192.168.1.10/api/parser/warrantyorder', fileBytes);

    res.send(response.data);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Internal Server Error');
  }
});


const startServer = () => {
  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });
};
const start = async () => {
  try {
    await sql`SELECT 1`;
    console.log('Connected to PostgreSQL database');
    await createTables();
    console.log('Tables created successfully');
    startServer();
  } catch (error) {
    console.error('Error during startup:', error);
  }
};

start();