const express = require('express');
const path = require('path');
const fs = require('fs');
const { prepareAssets } = require('./lib/assets');
const { createProductStore } = require('./lib/products');

async function createApp(options = {}) {
  await prepareAssets();
  const app = express();
  app.locals.basePath = '';
  const store = await createProductStore(options.databaseUrl ?? process.env.DATABASE_URL);
  const gallery = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/gallery.json'), 'utf8'));
  const errors = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/errors.json'), 'utf8'));
  const home = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/home.json'), 'utf8'));
  app.disable('x-powered-by');
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use('/assets', express.static(path.join(__dirname, 'public'), {redirect:false,index:false}));
  app.use('/vendor', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
  app.use((req, res, next) => {
    res.locals.siteName = 'Sweet Corner';
    res.locals.currentPath = req.path;
    res.locals.dataMode = store.mode;
    next();
  });
  const showError = (res, status) => {
    const error = errors[String(status)] || errors['500'];
    return res.status(status).render('pages/error', { title: error.title, error });
  };
  app.get(['/', '/index', '/home'], (req, res) => {
    res.render('pages/home', { title: 'Fresh cakes and pastries', images: gallery.images, ...home });
  });
  app.get(['/about','/despre'], (req, res) => res.render('pages/about', { title: 'About our bakery', images: gallery.images }));
  app.get('/contact', (req, res) => res.render('pages/contact', { title: 'Visit Sweet Corner' }));
  const recipes={
    fruit:{name:'Fruit bowl',ingredients:['Seasonal fruit','Plain yogurt','A little honey'],steps:['Wash and slice the fruit.','Add yogurt to a bowl.','Arrange the fruit and finish with honey.'],image:'tea'},
    chocolate:{name:'Chocolate cup',ingredients:['Dark chocolate','Warm milk','Fresh berries'],steps:['Melt the chocolate gently.','Stir in a little warm milk.','Serve in a cup with berries.'],image:'cake'},
    vanilla:{name:'Vanilla sundae',ingredients:['Vanilla ice cream','Sliced banana','Roasted almonds'],steps:['Place two scoops in a glass.','Add banana slices.','Sprinkle with almonds and serve immediately.'],image:'icecream'},
  };
  app.get('/recipe/:slug',(req,res)=>Object.hasOwn(recipes,req.params.slug)?res.render('pages/recipe',{recipe:recipes[req.params.slug]}):showError(res,404));
  app.get('/products', async (req, res, next) => {
    try {
      const type = typeof req.query.type === 'string' ? req.query.type : 'all';
      if (!['all', 'cake', 'pastry', 'icecream'].includes(type)) return showError(res, 400);
      const products = await store.list(type);
      const categories = await store.categories();
      res.render('pages/products', { title: 'Our products', products, categories, selectedType: type });
    } catch (error) { next(error); }
  });
  app.get('/product/:id', async (req, res, next) => {
    try {
      if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(Number(req.params.id))) return showError(res, 400);
      const product = await store.find(Number(req.params.id));
      if (!product) return showError(res, 404);
      res.render('pages/product', { title: product.name, product });
    } catch (error) { next(error); }
  });
  app.get('/health', (req, res) => res.json({ ready: true, dataMode: store.mode }));
  app.use((req, res) => showError(res, path.extname(req.path)==='.ejs'?400:(req.path==='/assets'||req.path.startsWith('/assets/')&&!path.extname(req.path))?403:404));
  app.use((error, req, res, next) => {
    console.error(error.message);
    if (res.headersSent) return next(error);
    showError(res, 500);
  });
  app.locals.close = () => store.close();
  return app;
}

if (require.main === module) {
  createApp().then(app => {
    const port = Number(process.env.PORT || 8089);
    const server = app.listen(port, '127.0.0.1', () => console.log(`Sweet Corner: http://127.0.0.1:${port}`));
    const stop = () => server.close(async () => { await app.locals.close(); process.exit(0); });
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { createApp };
