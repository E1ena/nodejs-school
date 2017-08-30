class FormClass {
    constructor(validate, getData) {
        this.data = this.getData();
        this.dataRegExp = {
            fio: /\S+\s+\S+\s+\S+/,
            email: /.+@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)/,
            phone: /\+7\(\d{3}\)\d{3}[\-]\d{2}[\-]\d{2}/
        }
    }

    getData() {
        let data = {
            fio: document.getElementById('fio').value, 
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
        return data;
    }

    submit() {
        let valid = this.validate(); 
        if (valid.isValid) {
            this._makeBtnNotActive();
            this._sendAjax(); 
        };    
    }

    validate() {
        let valid = {
            isValid: true,
            errorFields: []
        };      
        let isDataValid = {
            fio: this._validateData(this.dataRegExp.fio, this.data.fio),
            email: this._validateData(this.dataRegExp.email, this.data.email),
            phone: this._extraValidatePhoneData(this.dataRegExp.phone, this.data.phone),
        };
        for (let key in isDataValid) {
            isDataValid[key] ? this._validDataHandle(key) : this._notValidDataHandle(valid, key);
        };
        return valid;
    }

    _validateData(regExp, data) {
        return regExp.test(data);
    }

    _extraValidatePhoneData(regExp, data) {
        if (!this._validateData(regExp, data)) return false;

        let number=data.replace(/[^\d]/g, '');
        let sum=0;
        for (let i=0; i < number.length; i++) {
            sum = +sum + +number[i];               
        }
        if (sum>30) return false;
        else return true;
    }

    _validDataHandle(key) {
        document.getElementById(key).classList.add('success'); 
    }

    _notValidDataHandle(valid, key) {
        valid.isValid = false; 
        valid.errorFields.push(key);
        document.getElementById(key).classList.add('error'); 
        return valid; 
    }

    _makeBtnNotActive() {
        document.getElementById('submitButton').disabled = true;
    }

    _sendAjax() {
       console.log('аякс запрос');     
        let req=['success', 'error', 'progress']; 
        $.ajax({
            type: 'GET',
            url: `${req[Math.floor(Math.random() * req.length)]}.json`,            
            data: this.data,
            success: (data) => {                
                $('#resultContainer').addClass(`${data.status}`);
                $('#resultContainer').text(`${data.status}`);
                if (data.status === 'progress') { 
                    setTimeout(() => {
                        this.submit();
                    }, data.timeout);
                }                
            }
        }); 
    }

    static saveDataInLocalStorage ()  {
        let dataObj = localStorage.getItem('dataFromForm');
        dataObj == null ? dataObj= {} : dataObj = JSON.parse(dataObj);
        let inputs = document.getElementsByTagName('input');
        [...inputs].forEach( (item) => {
            item.addEventListener('blur', function () { 
                dataObj[this.id]= this.value;
                localStorage.setItem('dataFromForm', JSON.stringify(dataObj));
            }, true);
        })
    }
    static  setData(data) {
        for (let key in data) {
            document.getElementById(key).value = data[key];
        }
    }
}


document.getElementById('submitButton').onclick = (event)=>{
    event.preventDefault(); 
    window.MyForm = new FormClass();
    MyForm.submit();
    console.log(MyForm);    
}

window.onload = () => {
    if (localStorage.dataFromForm) {
        let data = JSON.parse(localStorage.getItem('dataFromForm'));
        FormClass.setData(data);
    };
    FormClass.saveDataInLocalStorage();
}


