/*****************************************************

                    Main.js

*****************************************************/

var stage = new PIXI.Container();

function init()
{
    renderer.backgroundColor = 0x22A7F0;
    renderer.render(stage);
    loop();
}

function loop()
{
    requestAnimationFrame(loop);
    renderer.render(stage);
}
