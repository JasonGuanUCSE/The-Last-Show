function Obituary({name,btn,setBtn})
{
    const getOb= async()=>{
    const promise2 = await fetch(`https://ri3guhrb6p5p5vapeht2wetx5u0uluiu.lambda-url.ca-central-1.on.aws/?name=${name}`,
    {
        method:"GET"      
    }
        );
    
          const obituary = await promise2.json();
          console.log('Name: ', obituary[0]["Name"]);
          console.log('BornDay: ', obituary[0]["BornDay"]);
          console.log('DeathDay: ',obituary[0]["DeathDay"]);
          console.log('Image: ', obituary[0]["Image"]);
          console.log('Audio: ', obituary[0]["Audio"]);
          console.log('Obituary: ', obituary[0]["Obituary"]);
          //print out the result of the lambda function
          console.log('Response from Get: ', promise2);
      }
    getOb();
    console.log("Button has been pressed"+btn);
    return(
        <div>
            <div id="noItems">
                No Obituary Yet
            </div>









        </div>

    );
}

export default Obituary;