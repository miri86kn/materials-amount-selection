import './App.css';
import {useState} from 'react'; 
import MaterialsSlider from './components/MaterialsSlider';


function App() {

  //Test input for the slider
  const [materials, setMaterials] = useState([
    { color:'red', startNumber:6, endNumber:23, name: 'A'},
    { color:'blue', startNumber:31, endNumber:64, name: 'B'},
    { color:'green', startNumber:75, endNumber:100, name: 'C'}
  ])

  return (
    <div className="App">
   
      <br/>
      <h5>Materials multirange slider test:</h5><br/> 

      <div className="container">
        <MaterialsSlider materials = {materials} overlap = {false} />
      </div>      
    
    
    </div>
  );
}

export default App;
