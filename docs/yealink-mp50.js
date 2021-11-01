class YealinkMP50
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
			if ((reportData.getUint8(0) == 0x02) && (reportData.getUint8(1) == 0x00)) status = 'bit2 set';	
			if ((reportData.getUint8(0) == 0x03) && (reportData.getUint8(1) == 0x00)) status = 'bit3 set';
			if ((reportData.getUint8(0) == 0x04) && (reportData.getUint8(1) == 0x00)) status = 'bit4 set';	
			if ((reportData.getUint8(0) == 0x05) && (reportData.getUint8(1) == 0x00)) status = 'bit5 set';	
			if ((reportData.getUint8(0) == 0x06) && (reportData.getUint8(1) == 0x00)) status = 'bit6 set';	
			if ((reportData.getUint8(0) == 0x07) && (reportData.getUint8(1) == 0x00)) status = 'bit7 set';
			if ((reportData.getUint8(0) == 0x08) && (reportData.getUint8(1) == 0x00)) status = 'bit8 set';	
			if ((reportData.getUint8(0) == 0x09) && (reportData.getUint8(1) == 0x00)) status = 'bit9 set';	
			if ((reportData.getUint8(0) == 0x0a) && (reportData.getUint8(1) == 0x00)) status = 'bita set';	
			if ((reportData.getUint8(0) == 0x0b) && (reportData.getUint8(1) == 0x00)) status = 'bitb set';
			if ((reportData.getUint8(0) == 0x0c) && (reportData.getUint8(1) == 0x00)) status = 'bitc set';	
			if ((reportData.getUint8(0) == 0x0d) && (reportData.getUint8(1) == 0x00)) status = 'bitd set';	
			if ((reportData.getUint8(0) == 0x0e) && (reportData.getUint8(1) == 0x00)) status = 'bite set';	
			if ((reportData.getUint8(0) == 0x0f) && (reportData.getUint8(1) == 0x00)) status = 'bitf set';
		
		}		
	  
		if (this.callback && status) this.callback(status);
    }	
}