import react,{useState,useEffect} from "react";
import OverLay from "./OverLay";
import ply from './ply.png';
import stp from './stp.png';
import { resolveTo } from "@remix-run/router";

function Obituary()
{
    const[name,setName] = useState("");
    const[btn,setBtn]=useState(null);
    const [obituaries,setObituary]= useState([]);
    const[defaultOpn,setDefault]=useState("");
    const [a,setA]=useState();
    var num =0;


    useEffect(()=>{
        if(document.getElementById(defaultOpn)){document.getElementById(defaultOpn).style.display="block";}
    },[obituaries])


    const getOb= async()=>{
        
    const promise2 = await fetch(`https://ri3guhrb6p5p5vapeht2wetx5u0uluiu.lambda-url.ca-central-1.on.aws/`,
    {
        method:"GET"      
    }
        );
    
          const obituary = await promise2.json();
          if(obituary==="No obituaries found"){setObituary(null);}
          else{setObituary(obituary);}



      }
      
    
    useEffect(()=>{
        if(btn==1){getOb();setBtn(null)}

    },[btn])

    useEffect(()=>
    {
        let obj = true;
        num++;
        if(obj===true&&num===1){getOb();obj=false;};



    },[])

    const[isPlaying,setIsPlaying] = useState(false);


    const playing =()=>
    {
        if(isPlaying)
        {
            return ply;
        }
        else
        {
            return stp;
        }





    }

    const playAudio = (index)=>
    {

        if(isPlaying&&document.getElementById(`sound-${index}`))
        {
            document.getElementById(`sound-${index}`).pause();
            setIsPlaying(false);
            setA(null);
        }
        else if(!isPlaying&&document.getElementById(`sound-${index}`))
        {
            document.getElementById(`sound-${index}`).play()
            setIsPlaying(true);
            setA(index)
        }


    }


    const formatDate=(e)=>
    {
        const date= new Date(e);
        const option = {month:'long',day:'numeric',year:'numeric'}
        const formatted = date.toLocaleDateString('en-US',option);
        return formatted;
    }

    const closeInfo=(index)=>
    {
        if(document.getElementById(`${index}`).style.display=="block")
        {
            document.getElementById(`${index}`).style.display="none";
        }
        else
        {
            document.getElementById(`${index}`).style.display="block";
        }
    }
    const defaultStyle={
        display:'none',
    };

    return(
        <div>
            
            
            <div id="showCase">

                {obituaries ?  obituaries.map((ob,index)=>
                <div id="Case" key={index}>
                    
                    <img id="Image" src={ob["Image"]} onClick={()=>closeInfo(ob["Name"])}/>
                    <div id="NameDeath">{ob["Name"]}</div>
                    <div id="Date">{formatDate(ob["BornDay"])} - {formatDate(ob["DeathDay"])}</div>
                    

                    <div id={`${ob["Name"]}`} style={defaultStyle}>
                        <p id="Description">{ob["Obituary"]}</p>
                        <audio id={`sound-${index}`} src={ob["Audio"]} type={ob["Audio"]}></audio>
                        <div id="play"><img src={index===a ? stp : ply} onClick={() => playAudio(index)} /></div>
                    </div>
                    
                </div>):<div id="noItems">
                {"No Obituary Yet"}
            </div>}
            
            
            </div>






            <OverLay name={name} setName={setName} btn={btn} setBtn={setBtn} defaultOpn={defaultOpn} setDefault={setDefault} />


        </div>

    );
}

export default Obituary;