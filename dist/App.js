import * as express from 'express';
class App {
    constructor() {
        this.express = express();
        this.mountRoutes();
    }
    mountRoutes() {
        const router = express.Router();
        router.get('/', (req, res) => {
            res.json({
                message: 'Hello ZEBRA 2!'
            });
        });
        this.express.use('/', router);
    }
}
export default new App().express;
//# sourceMappingURL=App.js.map