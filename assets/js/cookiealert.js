/*
 * Bootstrap Cookie Alert by Wruczek
 * https://github.com/Wruczek/Bootstrap-Cookie-Alert
 * Released under MIT license
 */
(function () {
    "use strict";

    var cookieAlert = document.querySelector(".cookiealert");
    var acceptCookies = document.querySelector(".acceptcookies");
    var rejectCookies = document.querySelector(".rejectcookies");

    window['ga-disable-G-13CWX5EBQG'] = true;

    if (!cookieAlert) {
       return;
    }

    cookieAlert.offsetHeight; // Force browser to trigger reflow (https://stackoverflow.com/a/39451131)

    // Show the alert if we cant find the "acceptCookies" cookie
    if (!getCookie("acceptCookies")) {
        cookieAlert.classList.add("show");
    } else {
        window['ga-disable-G-13CWX5EBQG'] = false;
        startEmailOctopus("f8604900-ec85-11ee-b446-37d7c053d593")
        startGoogleAnalytics("G-13CWX5EBQG")
    }

    // When clicking on the agree button, create a 1 year
    // cookie to remember user's choice and close the banner
    acceptCookies.addEventListener("click", function () {
        setCookie("acceptCookies", true, 365);
        cookieAlert.classList.remove("show");

        startGoogleAnalytics("G-13CWX5EBQG")
        startEmailOctopus("f8604900-ec85-11ee-b446-37d7c053d593")
        // dispatch the accept event
        window.dispatchEvent(new Event("cookieAlertAccept"))
    });

    // When clicking on the reject button, close the banner
    rejectCookies.addEventListener("click", function () {
        cookieAlert.classList.remove("show");

        // dispatch the accept event
        window.dispatchEvent(new Event("cookieAlertReject"))
    });

    function startEmailOctopus(dataform) {
        var imported = document.createElement('script');

        imported.src = "https://eomail6.com/form/f8604900-ec85-11ee-b446-37d7c053d593.js";
        document.head.appendChild(imported);
    }

    function startGoogleAnalytics(gaID) {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', gaID);
    }

    // Cookie functions from w3schools
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + "; SameSite=Strict";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})();
