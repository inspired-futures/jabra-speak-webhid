export default class JabraSpeak510
{
    constructor() {
		this.device = null;
    }

    async attach(callback)
    {
		this.callback = callback;
		
        if (!navigator.hid) throw "WebHID not available!!!";

        try {
            let devices = await navigator.hid.getDevices();
            this.device = await devices.find(d => d.vendorId === 2830 && d.productId === 1058);
            if (!this.device) this.device = (await navigator.hid.requestDevice({filters: [{vendorId: 2830, productId: 1058}]}))[0];
            if (!this.device.opened) await this.device.open();
            this.device.addEventListener('inputreport', this._handleDevice.bind(this));
            console.log("Attached to " + this.device.productName);
			
        } catch (e) {
            this.error = e;
            if (callback) callback(e);
            console.error("jabra speak 410 error", e);
        }
    }
	
    async detach()
    {
        if (this.device?.opened)
        {
            await this.device.close();
            this.device.removeEventListener('inputreport', this._handleDevice);
        }
    }	

	async clear()
	{
		await this.device.sendReport(0x04, Uint8Array.from([0x00]));
	}
	
	async connect()
	{
		await this.device.sendReport(0x04, Uint8Array.from([0x01]));
	}
	
	async mute()
	{
		await this.device.sendReport(0x04, Uint8Array.from([0x05]));
	}	
	
	async ring()
	{
		await this.device.sendReport(0x04, Uint8Array.from([0x08]));
	}
	
	async hold()
	{
		await this.device.sendReport(0x04, Uint8Array.from([0x12]));
	}	
	
    _handleDevice(event)
    {
		//console.debug("_handleDevice", event.data.getUint8(0), event.data.getUint8(1));
		
		let reportId = event.reportId;
		let reportData = event.data;

		let status = null;
		
		if (reportId == 0x01) 
		{
			if (reportData.getUint8(0) & 0x01) status = 'volume-down';		  
			if (reportData.getUint8(0) & 0x02) status = 'volume-up';
		}
		else
			
		if (reportId == 0x04) 
		{	  
			if ((reportData.getUint8(0) == 0x01) && (reportData.getUint8(1) == 0x00)) status = 'active';		// green on ringing
			if ((reportData.getUint8(0) == 0x02) && (reportData.getUint8(1) == 0x00)) status = 'idle';			// red on connected
			if ((reportData.getUint8(0) == 0x81) && (reportData.getUint8(1) == 0x00)) status = 'idle';			// red on ringing	
			if ((reportData.getUint8(0) == 0x13) && (reportData.getUint8(1) == 0x00)) status = 'mute pressed';	
		}		
	  
		if (this.callback && status) this.callback(status);
    }	
}