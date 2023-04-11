import logo from "./img.png";
import { useState } from "react";

function OverLay() {
  var time = new Date().toISOString()
  const[birth,setBirth] = useState("")
  const[death,setDeath] = useState(time.slice(0,16));
  const[name,setName] = useState("");
  console.log(time.slice(0,16));
  const[fileName,setFileName]= useState(null);
  const[Obituaries,setObituary] = useState([]);

  
  const closeOver=()=>
  {
    document.getElementById("over").style.display="none";
    console.log("Close");
    setBirth("");
    setDeath(time.slice(0,16));
    setName("");
    setFileName(null);

  }
  

  const onFileChange=(e)=>
  {
    setFileName("("+e.target.files[0]['name']+")");
  }
  console.log(name);
  
  
  
  return (
      
        <div id="over" >
          <div id="CloseOver"onClick={closeOver}>
            &times;
        </div>
          <div id="TitleOverLay" >
            Create a New Obituary
          </div>
          
          
          
          <div id="OverLayPic">
            <img src={logo} width="200px" height="200px"></img>
            <label id = "imgName"htmlFor="imgSelect">Select an image for the deceased {1&&(fileName)}</label>
            <input type="file" id="imgSelect" accept="image/*" onChange={(e)=>onFileChange(e)}/>
          </div> 

          <div id="NameDied">

            <input type="text" placeholder="Name of the deceased" value={name} onChange={(e)=>setName(e.target.value)}/>

          </div>
          <div id="OverLayDates">
            <p><i>Born: </i></p>
            <input type="datetime-local" value={birth} onChange = {(e)=>setBirth(e.target.value)}/>
            <p><i>Died: </i></p>
            <input type="datetime-local" value={death} onChange={(e)=>setDeath(e.target.value)} />

          </div>

          <div id="WriteObituary">
            <button onClick={writeOb}>Write Obituary</button>
          </div>

        </div>


    );
  }
  
export default OverLay;