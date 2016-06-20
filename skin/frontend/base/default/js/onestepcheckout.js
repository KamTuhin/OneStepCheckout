var Onestep = Class.create();
Onestep.prototype = {
    initialize: function(saveUrl, successUrl, parentId){
        this.saveUrl = saveUrl;
        this.successUrl = successUrl;
        this.parentId = parentId;
        this.onSave = this.nextStep.bindAsEventListener(this);
        this.onComplete = this.resetLoadWaiting.bindAsEventListener(this);
    },

    save: function(){
            var validator = new Validation(this.parentId);
            if (validator.validate()) {
                checkout.setLoadWaiting('payment');
                var request = new Ajax.Request(
                    this.saveUrl,
                    {
                        method:'post',
                        onComplete: this.onComplete,
                        onSuccess: this.onSave,
                        onFailure: checkout.ajaxFailure.bind(checkout),
                        parameters: Form.serialize(this.parentId)
                    }
                );
            }
        },

    resetLoadWaiting: function(transport){
        checkout.setLoadWaiting(false, this.isSuccess);
    },

    nextStep: function(transport){
        if (transport && transport.responseText) {
            try{
                response = eval('(' + transport.responseText + ')');
            }
            catch (e) {
                response = {};
            }
            if (response.redirect) {
                this.isSuccess = true;
                location.href = response.redirect;
                return;
            }
            if (response.success) {
                this.isSuccess = true;
                window.location=this.successUrl;
            }
            else{
                var msg = response.error_messages;
                if (typeof(msg)=='object') {
                    msg = msg.join("\n");
                }
                if (msg) {
                    alert(msg);
                }
            }

            if (response.update_section) {
                $('checkout-'+response.update_section.name+'-load').update(response.update_section.html);
            }

            if (response.goto_section) {
                checkout.gotoSection(response.goto_section);
                checkout.reloadProgressBlock();
            }
        }
    },

    isSuccess: false
}
