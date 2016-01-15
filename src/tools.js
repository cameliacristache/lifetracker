export class Tools {
    setCookie(cname, cvalue, hours) {
        var d = new Date();
        d.setTime(d.getTime() + (hours*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return "";
    }

    getPicture(gender, xp) {
        var path = "/images/";
        if (gender == 1) {
            path = path + "agumon";
        } else {
            path = path + "biyomon";
        }

        if (xp < 301) {
            path = path + "1.png";
        }

        if ((xp > 300) && (xp < 601)) {
            path = path + "2.png";
        }

        if ((xp > 600) && (xp < 1201)) {
            path = path + "3.png";
        }

        if ((xp > 1200) && (xp < 2101)) {
            path = path + "4.png";
        }

        if ((xp > 2100) && (xp < 3301)) {
            path = path + "5.png";
        }

        if (xp > 3300) {
            path = path + "6.png";
        }

        return path;
    }

    getXPtotal(level) {
        var xp=3300;
        if(level == 1) {
            xp = 300;
        }
        if(level == 2) {
            xp = 600;
        }
        if(level == 3) {
            xp = 1200;
        }
        if(level == 4) {
            xp = 2100;
        }
        if(level == 5) {
            xp = 3300;
        }
        return xp
    }
}
