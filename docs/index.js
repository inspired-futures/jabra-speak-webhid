import JabraSpeak410 from "./jabra-speak-410.js";
import JabraSpeak510 from "./jabra-speak-510.js";
import YealinkMP50 from "./yealink-mp50.js";

window.jabra = null;

window.addEventListener("unload", function()
{
	if (window.jabra) window.jabra.detach();
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

    clear.addEventListener('click', 	event => { if (jabra) window.jabra.clear() });	
    connect.addEventListener('click', 	event => { if (jabra) window.jabra.connect() });
	ring.addEventListener('click', 		event => { if (jabra) window.jabra.ring() });
    mute.addEventListener('click', 		event => { if (jabra) window.jabra.mute() });
    hold.addEventListener('click', 		event => { if (jabra) window.jabra.hold() });
	
	
    attach.addEventListener('click', event => 
	{
		window.jabra = (device.value == "jabra-speak-410") ?  new JabraSpeak410() : ((device.value == "jabra-speak-510") ?  new JabraSpeak510() : new YealinkMP50());			
		
		window.jabra.attach(event => 
		{
			console.debug("jabra event", event);
			events.innerHTML += event + "<br/>"
		});
	});
});
