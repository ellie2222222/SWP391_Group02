require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const userRoutes = require('./routes/user')
const usersRoutes = require('./routes/users')
const jewelryRoutes = require('./routes/jewelry')
const requestRoutes = require('./routes/request')
const materialRoutes = require('./routes/material')
const gemstoneRoutes = require('./routes/gemstone')
const warrantyRoutes = require('./routes/warranty')
const blogRoutes = require('./routes/blog')
const worksOnRoutes = require('./routes/worksOn');
const designRoutes = require('./routes/design');
const invoiceRoutes = require('./routes/invoice');
const transactionRoutes = require('./routes/transaction');

//application
const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const allowedOrigins = ['http://localhost:3000', 'https://frontend-chk2.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//router
app.use('/api/user', userRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/jewelries', jewelryRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/gemstones', gemstoneRoutes)
app.use('/api/warranties', warrantyRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/works-on', worksOnRoutes)
app.use('/api/designs', designRoutes)
app.use('/api/invoices', invoiceRoutes);
app.use('/api/transactions', transactionRoutes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen 
    app.listen(process.env.PORT, () => {
      console.log('Connected to database! Listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })

const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment

// APP INFO
let config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const requireAuth = require('./middleware/requireAuth');
app.post('/api/payment', requireAuth, async (req, res) => {
  const { user_info, product } = req.body;

  const embed_data = {
    // redirecturl: "https://frontend-chk2.onrender.com/",
    redirecturl: `http://localhost:3000/products/${product._id}/payment-status`,
    preferred_payment_method: ["domestic_card",  "account"],
  };
  
  const items = [{ product }];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: req.id,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: product.on_sale === true ? (product.price - (product.price * (product.sale_percentage / 100))) : product.price,
    description: `Payment for the order #${transID}`,
    bank_code: "",
    email: user_info.email,
    phone: user_info.phone,
    address: user_info.address,
    // callback_url: "https://ee14-2001-ee0-4f83-e990-e855-8bf6-1042-f79f.ngrok-free.app/callback",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL").toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order })

    return res.status(200).json({ result: result.data, trans_id: order.app_trans_id })
  } catch (error) {
    console.log(error.message)
  }
})


const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/callback', (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

const qs = require('qs');

app.post('/api/order-status/:app_trans_id', requireAuth, async (req, res) => {
  const { app_trans_id } = req.params
  
  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id, // Input your app_trans_id
  }

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


  let postConfig = {
    method: 'post',
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
  };

  try {
    const result = await axios(postConfig)

    return res.status(200).json(result.data)
  } catch (error) {
    console.log(error.message)
  }
})