import Nav from './components/Nav/';
import Main from './components/Main';
import SoundSelection from './components/SoundSelection';
import DisplaySection from './components/DisplaySection';
import WebgiViewer from './components/WebgiViewer';

function App() {

  return (
    <div className="App">
      <Nav />
      <Main />
      <SoundSelection />
      <DisplaySection />
      <WebgiViewer />
    </div>
  );
}

export default App;
