/*****************************************************

                    Main.js

*****************************************************/

let stage = new PIXI.Container();


function init()
{

    console.log("aaaa");

    renderer.backgroundColor = 0x1111F0;
    renderer.render(stage);
    
    loop();

    
}

function loop()
{
    requestAnimationFrame(loop);
    renderer.render(stage);

   
    
}
