class Chart {
    get class() { return 'Chart' };
    constructor(el = '') {
        if (el == '') {
            this.set = { "reloc": false, "type": "horo", "house": defA3D.houses, "planets": defA3D.planets, "aspects": defA3D.aspects };
            this.out = {};
            this.in = {};
            this.in.dateToJSON = new Date().toJSON();
            this.in.name = '';
            this.in.sex = "-";
            this.in.city = defA3D.city;
            this.in.timezone = defA3D.tz;
            this.in.tzMin = new Date().getTimezoneOffset();
            this.in.country = navigator.language.split('-')[1];
            this.in.latitude = defA3D.latitude;
            this.in.longitude = defA3D.longitude;
        }else{
            if(el.in){
            this.set = el.set;
            this.out = el.out;
            this.in = el.in;
            this.in.dateToJSON = el.in.dateToJSON;
            this.in.date = el.in.date;
            this.in.name = el.in.name;
            this.in.sex = el.in.sex;
            this.in.city = el.in.city;
            this.in.timezone = el.in.timezone;
            this.in.tzMin = el.in.tzMin;
            this.in.country = el.in.country;
            this.in.latitude = el.in.latitude;
            this.in.longitude = el.in.longitude;}
            else{
                this.set = { "reloc": false, "type": "horo", "house": defA3D.houses, "planets": defA3D.planets, "aspects": defA3D.aspects };
                this.out = {};
                this.in = {};
                this.in.dateToJSON = el.dateToJSON;
                this.date = el.date;
                this.in.name = el.name;
                this.in.sex = el.sex;
                this.in.city = el.in.name;
                this.in.timezone = el.city;
                this.in.tzMin = el.tzMin;
                this.in.country = el.country;
                this.in.latitude = el.latitude;
                this.in.longitude = el.longitude;
            }
        }
    }
}