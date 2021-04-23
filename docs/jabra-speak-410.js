export default class JabraSpeak410
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
            this.device = await devices.find(d => d.vendorId === 2830 && d.productId === 1042);
            if (!this.device) this.device = (await navigator.hid.requestDevice({filters: [{vendorId: 2830, productId: 1042}]}))[0];
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
		await this.device.sendReport(0x03, Uint8Array.from([0x00]));
	}
	
	async connect()
	{
		await this.device.sendReport(0x03, Uint8Array.from([0x01]));
	}
	
	async mute()
	{
		await this.device.sendReport(0x03, Uint8Array.from([0x05]));
	}	
	
	async ring()
	{
		await this.device.sendReport(0x03, Uint8Array.from([0x08]));
	}
	
	async hold()
	{
		await this.device.sendReport(0x03, Uint8Array.from([0x09]));
	}	
	
    _handleDevice(event)
    {
		let reportId = event.reportId;
		let reportData = event.data;

		let status = null;
		
		if (reportId == 0x01) 
		{
			if (reportData.getUint8(0) & 0x01) status = 'volume-down';		  
			if (reportData.getUint8(0) & 0x02) status = 'volume-up';
		}
		else
			
		if (reportId == 0x03) 
		{	  
			if ((reportData.getUint8(0) == 0x01) && (reportData.getUint8(1) == 0x00)) status = 'active';
			if ((reportData.getUint8(0) == 0x00) && (reportData.getUint8(1) == 0x00)) status = 'idle';
			if ((reportData.getUint8(0) == 0x08) && (reportData.getUint8(1) == 0x00)) status = 'mute pressed';	
			if ((reportData.getUint8(0) == 0x09) && (reportData.getUint8(1) == 0x00)) status = 'mute pressed';	
		}		
	  
		if (this.callback && status) this.callback(status);
    }	
}