import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const XmlViewer = ({ xmlString }) => {
  const [viewMode, setViewMode] = useState('code');
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [parsedTree, setParsedTree] = React.useState(null);
  const [switching, setSwitching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showCopyModal, setShowCopyModal] = useState(false);

  React.useEffect(() => {
    setInitialLoading(true);
    const timer = setTimeout(() => setInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, [xmlString]);

  React.useEffect(() => {
    if (viewMode === 'tree' && !parsedTree) {
      setSwitching(true);
      setTimeout(() => {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(xmlString, 'text/xml');
          setParsedTree(doc.documentElement);
        } catch (e) {
          setParsedTree(null);
        }
        setSwitching(false);
      }, 200);
    } else if (viewMode === 'code') {
      setSwitching(true);
      setTimeout(() => setSwitching(false), 100);
    }
  }, [viewMode, parsedTree, xmlString]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xmlString);
      
      const selection = window.getSelection();
      const range = document.createRange();
      const codeElement = document.querySelector('pre code') || document.querySelector('code');
      
      if (codeElement) {
        range.selectNodeContents(codeElement);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      setShowCopyModal(true);
      setTimeout(() => setShowCopyModal(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = xmlString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowCopyModal(true);
      setTimeout(() => setShowCopyModal(false), 2000);
    }
  };

  const renderTreeNode = (node, path = '0') => {
    if (!node || node.nodeType === 3) return null;
    
    const isExpanded = expandedNodes.has(path);
    const hasChildren = node.children && node.children.length > 0;
    
    const toggleNode = () => {
      const newExpanded = new Set(expandedNodes);
      if (isExpanded) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setExpandedNodes(newExpanded);
    };

    return (
      <div key={path} style={{ marginLeft: '20px' }}>
        <div 
          style={{ 
            cursor: hasChildren ? 'pointer' : 'default',
            padding: '2px 0',
            fontFamily: 'monospace'
          }}
          onClick={hasChildren ? toggleNode : undefined}
        >
          {hasChildren && (
            <span style={{ marginRight: '5px' }}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span style={{ color: '#0066cc' }}>&lt;{node.tagName}</span>
          {Array.from(node.attributes || []).map(attr => (
            <span key={attr.name}>
              <span style={{ color: '#cc6600' }}> {attr.name}</span>
              <span>=</span>
              <span style={{ color: '#009900' }}>"{attr.value}"</span>
            </span>
          ))}
          <span style={{ color: '#0066cc' }}>&gt;</span>
          {node.textContent && !hasChildren && (
            <span style={{ color: '#000' }}>{node.textContent}</span>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div>
            {Array.from(node.children).map((child, index) => 
              renderTreeNode(child, `${path}-${index}`)
            )}
          </div>
        )}
      </div>
    );
  };



  const customStyle = {
    ...prism,
    'pre[class*="language-"]': {
      ...prism['pre[class*="language-"]'],
      background: '#ffffff',
      color: '#000000'
    }
  };



  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        zIndex: 1000,
        padding: '20px',
        borderBottom: '1px solid #ddd',
        display: 'flex', 
        gap: '10px', 
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={() => setViewMode('code')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: viewMode === 'code' ? '#007acc' : '#f0f0f0',
            color: viewMode === 'code' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg> Код
        </button>
        <button 
          onClick={() => setViewMode('tree')}
          style={{ 
            padding: '8px 16px',
            backgroundColor: viewMode === 'tree' ? '#007acc' : '#f0f0f0',
            color: viewMode === 'tree' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8,2H16A2,2 0 0,1 18,4V6A2,2 0 0,1 16,8H13V9H16A2,2 0 0,1 18,11V13A2,2 0 0,1 16,15H13V16H16A2,2 0 0,1 18,18V20A2,2 0 0,1 16,22H8A2,2 0 0,1 6,20V18A2,2 0 0,1 8,16H11V15H8A2,2 0 0,1 6,13V11A2,2 0 0,1 8,9H11V8H8A2,2 0 0,1 6,6V4A2,2 0 0,1 8,2Z"/>
          </svg> Дерево
        </button>

        <button 
          onClick={handleCopy}
          style={{ 
            padding: '8px 12px',
            backgroundColor: '#f0f0f0',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
          </svg>
        </button>

      </div>

      <div style={{ marginTop: '80px' }}>
      {initialLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          flexDirection: 'column'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #007acc',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Загрузка XML...</p>
        </div>
      ) : switching ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px'
        }}>
          <div style={{
            width: '25px',
            height: '25px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #007acc',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
        </div>
      ) : viewMode === 'code' ? (
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
          <div style={{
            backgroundColor: '#f8f8f8',
            padding: '10px 8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#666',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            pointerEvents: 'none',
            borderRight: '1px solid #ddd',
            minWidth: '50px',
            textAlign: 'right'
          }}>
            {xmlString.split('\n').map((_, index) => (
              <div key={index} style={{ lineHeight: '1.5' }}>{index + 1}</div>
            ))}
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <SyntaxHighlighter
              language="xml"
              style={customStyle}
              showLineNumbers={false}
              wrapLines={true}
              customStyle={{
                margin: 0,
                background: '#ffffff',
                fontSize: '14px',
                userSelect: 'text',
                outline: 'none',
                padding: '10px'
              }}
              PreTag="div"
              CodeTag="code"
            >
              {xmlString}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          padding: '10px',
          backgroundColor: '#ffffff',
          maxHeight: '600px',
          overflow: 'auto',
          userSelect: 'text'
        }}>
          {parsedTree ? 
            renderTreeNode(parsedTree) : 
            <div style={{ color: 'red' }}>Ошибка парсинга XML</div>
          }
        </div>
      )}
      </div>
      {showCopyModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          XML скопирован в буфер обмена
        </div>
      )}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        * {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
      `}</style>
    </div>
  );
};

export default XmlViewer;