import logo from "./img.png";
import { useState } from "react";

function OverLay({name,setName,btn,setBtn,defaultOpn,setDefault}) {
  var time = new Date().toISOString()
  const[birth,setBirth] = useState("")
  const[death,setDeath] = useState(time.slice(0,16));
  // const[name,setName] = useState("");
  const[fileName,setFileName]= useState(null);
  const[file ,setFile]=useState(null);
  // const[btn,setBtn]=useState(null);
  //const[Obituaries,setObituary] = useState([]);
  
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
    if(e.target.files[0])
    {
      setFileName("("+e.target.files[0]['name']+")");
      setFile(e.target.files[0]);
    }
    // setFileName("("+e.target.files[0]['name']+")");
    // setFile(e.target.files[0]);
    
  }
  //console.log(name);


  const writeOb= async()=>
  {
    console.log(name,birth,death,file);
    const Data = new FormData();
    Data.append("name",name);
    Data.append("birth",birth);
    Data.append("death",death);
    Data.append("file",file);
    const resetBtn = document.querySelector("#write")
    resetBtn.disabled=true;
    document.getElementById("write").style.backgroundColor="#c0bcbc";
    resetBtn.innerText="Please wait.It's not like they're gonna be late for something ...";

    const promise = await fetch("https://sstjz4m6agqlfqewwqhdyvhw6q0fsyux.lambda-url.ca-central-1.on.aws/",
      {
        method:"POST",
        body:Data,
      }
    )
    setBtn(1);
    console.log("Response from create: ",promise);
    closeOver();
    if(promise.ok)
    {
      resetBtn.disabled=false;
      resetBtn.innerText="Write Obituary";
      document.getElementById("write").style.backgroundColor="#30cca4";
    }
    setDefault(name);

  }

   
  
  
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
              <button id="write" onClick={writeOb}>Write Obituary</button>
            </div>

        </div>


    );
  }
  
export default OverLay;