const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const {createProductStore} = require('./lib/products');
const {projectDatabaseSettings} = require('./lib/database');

// Rebase local URLs after EJS rendering, including dynamically generated images.
function projectUrls(html, base) {
  return html.replace(/((?:href|src|srcset|poster|action)\s*=\s*["']?)(\/(?!\/)|(?=resurse\/))/gi, '$1'+base+'/');
}
async function createApp(options={}) {
  const app=express();
  app.locals.basePath='/project';
  app.disable('x-powered-by');
  app.set('view engine','ejs');
  app.set('views',path.join(__dirname,'views'));
  const errors=JSON.parse(fs.readFileSync(path.join(__dirname,'resurse/json/erori.json'),'utf8'));
  const gallery=JSON.parse(fs.readFileSync(path.join(__dirname,'resurse/json/galerie.json'),'utf8'));
  const images=gallery.imagini.map(image=>({...image,
    fisier:'/'+gallery.cale_galerie+'/'+image.fisier,
    fisier_mediu:'/'+gallery.cale_galerie+'/mediu/'+path.parse(image.fisier).name+'.webp'}));
  // The home page and assets do not need SQL; initialize it only for the catalog.
  let storePromise;
  const store=()=>storePromise??=(createProductStore(options.databaseSettings??(options.databaseUrl?{connectionOptions:{connectionString:options.databaseUrl},schema:'dulcelind'}:projectDatabaseSettings(options.env??process.env))).catch(error=>{storePromise=undefined;throw error;}));
  app.locals.close=async()=>{if(storePromise)await(await storePromise).close();};
  app.use((req,res,next)=>{
    const render=res.render.bind(res);
    res.render=(view,locals={})=>render(view,locals,(error,html)=>{
      if(error)return next(error);
      res.send(projectUrls(html,app.locals.basePath));
    });
    next();
  });
  app.get('/resurse/css/:file',(req,res,next)=>{
    if(!/^[\w.-]+\.css$/.test(req.params.file))return next();
    const filename=path.join(__dirname,'resurse/css',req.params.file);
    if(!fs.existsSync(filename))return next();
    const css=fs.readFileSync(filename,'utf8').replace(/(url\(\s*["']?)\/resurse\//gi,'$1'+app.locals.basePath+'/resurse/');
    res.type('css').send(css);
  });
  app.use('/resurse',express.static(path.join(__dirname,'resurse'),{redirect:false,index:false,dotfiles:'deny'}));
  app.use('/dist',express.static(path.join(__dirname,'../node_modules/bootstrap/dist'),{redirect:false,index:false}));
  app.get('/favicon.ico',(req,res)=>res.sendFile(path.join(__dirname,'resurse/imagini/favicon/favicon.ico')));
  function showError(res,code) {
    const error=errors.info_erori.find(e=>e.identificator===code)||errors.eroare_default;
    return res.status(code>=400?code:500).render('pagini/eroare',{
      titlu:error.titlu,text:error.text,imagine:errors.cale_baza+'/'+error.imagine});
  }
  app.get(['/','/index','/home'],(req,res)=>res.render('pagini/index',{imagini:images}));
  app.get('/despre',(req,res)=>res.render('pagini/despre'));
  app.get('/produse',async(req,res,next)=>{
    try{
      const type=req.query.tip;
      if(type!==undefined&&(typeof type!=='string'||!['cofetarie','patiserie','gelaterie'].includes(type)))return showError(res,400);
      const db=await store();
      res.render('pagini/produse',{produse:await db.list(type),optiuni:await db.categories()});
    }catch(error){next(error);}
  });
  app.get('/produs/:id',async(req,res,next)=>{
    try{
      if(!/^\d+$/.test(req.params.id)||!Number.isSafeInteger(Number(req.params.id)))return showError(res,400);
      const product=await(await store()).find(Number(req.params.id));
      if(!product)return showError(res,404);
      res.render('pagini/produs',{prod:product});
    }catch(error){next(error);}
  });
  app.get('/health',async(req,res,next)=>{
    try {const db=await store();res.json({ready:true,project:'Dulcelind',database:db.mode,...await db.health()});}
    catch(error){next(error);}
  });
  app.use((req,res)=>showError(res,path.extname(req.path)==='.ejs'?400:((req.path==='/resurse'||req.path.startsWith('/resurse/'))&&!path.extname(req.path))?403:404));
  app.use((error,req,res,next)=>{
    console.error('Dulcelind:',error.message);
    if(res.headersSent)return next(error);
    showError(res,500);
  });
  return app;
}
if(require.main===module){
  createApp().then(app=>{
    const parent=express();parent.get('/',(req,res)=>res.redirect('/project/'));parent.use('/project',app);
    const port=Number(process.env.PORT||8089);
    const server=parent.listen(port,process.env.HOST||'127.0.0.1',()=>console.log('Dulcelind: http://127.0.0.1:'+port+'/project/'));
    const stop=()=>server.close(async()=>{await app.locals.close();process.exit(0);});
    process.once('SIGINT',stop);process.once('SIGTERM',stop);
  }).catch(error=>{console.error(error);process.exitCode=1;});
}
module.exports={createApp,projectUrls};
