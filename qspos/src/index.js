import dva from 'dva';
import 'antd/dist/antd.less';
import './index.css';

// 1. Initialize
const app = dva();





// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example'));
app.model(require("./models/header"));
app.model(require("./models/sell"));
app.model(require("./models/returngoods"));
app.model(require("./models/receivegoods"));
app.model(require("./models/inventorydiff"));
app.model(require("./models/inventory"));
app.model(require("./models/adjust"));
app.model(require("./models/goods"));
app.model(require("./models/cashier"));
app.model(require("./models/member"));
app.model(require("./models/table"));
app.model(require("./models/account"));


// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
