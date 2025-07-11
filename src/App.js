import React from 'react';
import ReactDOM from 'react-dom/client';
import XmlViewer from './XmlViewer';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

window.start = function(xml, param2) {
  root.render(<XmlViewer xmlString={xml} />);
}

function App() {
  return <div></div>;
}

export default App;
