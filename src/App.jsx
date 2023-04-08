import React from 'react';
import { useRef } from 'react';
import Nav from './components/Nav/';
import Main from './components/Main';
import SoundSelection from './components/SoundSelection';
import DisplaySection from './components/DisplaySection';
import WebgiViewer from './components/WebgiViewer';
import Loader from './components/Loader';
import Footer from './components/Footer';

function App() {
  const webgiViewerRef = useRef();

  // 将WebgiViewer组件内方法传递到DisplaySection组件
  const handlePreview = () => {
    webgiViewerRef.current.triggerPreview();
  }

  const contentRef = useRef(null);

  return (
    <div className="App">
      <Loader />
      <div ref={contentRef} id="content">
        <Nav />
        <Main />
        <SoundSelection />
        <DisplaySection />
        <Footer triggerPreview={handlePreview}  />
      </div>

      <WebgiViewer contentRef={contentRef} ref={webgiViewerRef} />
    </div>
  );
}

export default App;
