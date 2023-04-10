import OverLay from "./OverLay";



function App() {
  

  const enableOverLay=()=>
  {
    document.getElementById("over").style.display="flex";

  }

  return(
  <div id="App">
    <div id ="TitlePage">

      <div></div>
      <div id="Title">The Last Show</div>
      <div id="ObituaryBtn" onClick={enableOverLay}>+ New Obituary</div>

    </div>
  </div>);
}

export default App;
