import React from 'react';
import { ConfigProvider } from 'antd';
import PaymentGatewayExplanation from './payment';
import "./App.css";

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
  >
    <div className="App">
      <PaymentGatewayExplanation />
    </div>
  </ConfigProvider>
);

export default App;