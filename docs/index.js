import JabraSpeak410 from "./jabra-speak-410.js";
import JabraSpeak510 from "./jabra-speak-510.js";
import YealinkMP50 from "./yealink-mp50.js";

let jabra = null;

window.addEventListener("unload", function()
{
	if (jabra) jabra.detach();
});

window.addEventListener("load", function()
{
    const attach = document.getElementById("attach");	
    const clear = document.getElementById("clear");			
    const connect = document.getElementById("connect");
	const ring = document.getElementById("ring");
    const mute = document.getElementById("mute");
    const hold = document.getElementById("hold");
    const events = document.getElementById("events");	
    const device = document.getElementById("device");

    clear.addEventListener('click', 	event => { if (jabra) jabra.clear() });	
    connect.addEventListener('click', 	event => { if (jabra) jabra.connect() });
	ring.addEventListener('click', 		event => { if (jabra) jabra.ring() });
    mute.addEventListener('click', 		event => { if (jabra) jabra.mute() });
    hold.addEventListener('click', 		event => { if (jabra) jabra.hold() });
	
	
    attach.addEventListener('click', event => 
	{
		jabra = (device.value == "jabra-speak-410") ?  new JabraSpeak410() : ((device.value == "jabra-speak-510") ?  new JabraSpeak510() : new YealinkMP50());			
		
		jabra.attach(event => 
		{
			console.debug("jabra event", event);
			events.innerHTML += event + "<br/>"
		});
	});
});
