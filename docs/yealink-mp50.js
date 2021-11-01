export default class YealinkMP50
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
            this.device = await devices.find(d => d.vendorId === 27027 && d.productId === 45120);
            if (!this.device) this.device = (await navigator.hid.requestDevice({filters: [{vendorId: 27027, productId: 45120}]}))[0];
            if (!this.device.opened) await this.device.open();
            this.device.addEventListener('inputreport', this._handleDevice.bind(this));
            console.log("Attached to " + this.device.productName);
			
        } catch (e) {
            this.error = e;
            if (callback) callback(e);
            console.error("yealink mp50 error", e);
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
		await this.device.sendReport(0x02, Uint8Array.from([0x00]));
	}
	
	async connect()
	{
		await this.device.sendReport(0x02, Uint8Array.from([0x01]));
	}
	
	async ring()
	{
		await this.device.sendReport(0x02, Uint8Array.from([0x05]));
	}	
	
	async hold()
	{
		await this.device.sendReport(0x02, Uint8Array.from([0x08]));
	}
	
	async mute()
	{
		await this.device.sendReport(0x02, Uint8Array.from([0x03]));
	}	
	
    _handleDevice(event)
    {
		let reportId = event.reportId;
		let reportData = event.data;
		
		console.debug("_handleDevice", event.reportId, event.data);

		let status = null;
		
		if (reportId == 0x01) 
		{
			if (reportData.getUint8(0) & 0x01) status = 'volume-up';		  
			if (reportData.getUint8(0) & 0x02) status = 'volume-down';
		}
		else
			
		if (reportId == 0x02) 
		{	  
			if ((reportData.getUint8(0) == 0x01) && (reportData.getUint8(1) == 0x00)) status = 'active';
			if ((reportData.getUint8(0) == 0x00) && (reportData.getUint8(1) == 0x00)) status = 'idle';
			if ((reportData.getUint8(0) == 0x08) && (reportData.getUint8(1) == 0x00)) status = 'mute pressed';	
			if ((reportData.getUint8(0) == 0x09) && (reportData.getUint8(1) == 0x00)) status = 'mute pressed';	
		}		
	  
		if (this.callback && status) this.callback(status);
    }	
}