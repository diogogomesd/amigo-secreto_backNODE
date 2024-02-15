import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import siteRoutes from './routes/site';
import adminRoutes from './routes/admin';
import { RequestInterceptor } from './utils/RequestInterceptor';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.all('*', RequestInterceptor);

app.use('/admin', adminRoutes)
app.use('/', siteRoutes)

const runServer = (port: number, server: http.Server) => {
    server.listen(port, () => {
        console.log(`rodando na porta ${port}`)
    });
}

const regularServer = http.createServer(app);
if(process.env.NODE_ENV === 'production'){
    //TO DO: configurar ssl e rodar servidor na porta 80 e na 443
}else{
    const serverPort: number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
    runServer(serverPort, regularServer);
}