import OverLay from "./OverLay";
import Obituary from './Obituary';
import { useState } from "react";


function App() {
  
  const[name,setName] = useState("");
  const[btn,setBtn]=useState(null);

  const enableOverLay=()=>
  {
    document.getElementById("over").style.display="flex";
    console.log("Open");

  }

  return(
  <div id="App">
    <div id ="TitlePage">

      <div></div>
      <div id="Title">The Last Show</div>
      <div id="ObituaryBtn" onClick={enableOverLay}>+ New Obituary</div>

    </div>
    <OverLay name={name} setName={setName} btn={btn} setBtn={setBtn}/>
    <Obituary name={name} btn={btn} setBtn={setBtn}/>
  </div>);
}

export default App;
