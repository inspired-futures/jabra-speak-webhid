import JabraSpeak410 from "./jabra-speak-410.js";
import JabraSpeak510 from "./jabra-speak-510.js";

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

	jabra = (device.value == "jabra-speak-410") ?  new JabraSpeak410() : new JabraSpeak510();	

    clear.addEventListener('click', event => { jabra.clear() });	
    connect.addEventListener('click', event => { jabra.connect() });
	ring.addEventListener('click', event => { jabra.ring() });
    mute.addEventListener('click', event => { jabra.mute() });
    hold.addEventListener('click', event => { jabra.hold() });
	
	
    attach.addEventListener('click', event => 
	{
		jabra.attach(event => 
		{
			console.debug("jabra event", event);
			events.innerHTML += event + "<br/>"
		});
	});
});
