
import './App.css';
import {useState} from 'react';
import MultiSliderRange from './components/MultiSliderRange';


function App() {

  //Test input for the slider
  const [materials, setMaterials] = useState([
    { color:'red', startNumber:0, endNumber:30},
    { color:'blue', startNumber:31, endNumber:70},
    { color:'green', startNumber:71, endNumber:100}
  ])

  return (
    <div className="App">
      <h5>Materials multirange slider test:</h5><br/>
      
      <div className="container">
        <MultiSliderRange materials = {materials} />
      </div>

      
    </div>
  );
}

export default App;
