import logo from './logo.svg';
import './App.css';

import HeaderComponent from './components/Header/Header';
import ContentComponent from './components/Content/Content';

import { Layout, Space } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const maxHeight = "calc(100vh - 64px)"
const headerStyle = {
  // textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#ccc',
};
const contentStyle = {
  padding: "0 10px",
  height: maxHeight,
  backgroundColor: '#fff',
  overflow: "scroll"
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};

function App() {
  return (
    <div className="App">
<Space
    direction="vertical"
    style={{
      width: '100%',
    }}
    size={[0, 48]}
  >
    <Layout>
      <Header style={headerStyle}><HeaderComponent /></Header>
      <Layout>
        <Content style={contentStyle}><ContentComponent /></Content>
      </Layout>
    </Layout>
  </Space>
    </div>
  );
}

export default App;
