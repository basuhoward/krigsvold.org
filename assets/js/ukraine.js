var UKRAINE = UKRAINE || (function(){
    let _args = {};
    let messages = [
        "We stand with 🇺🇦 Ukraine #StandWithUkraine",
        "Russia's war against 🇺🇦 Ukraine is real and raw. Our hearts are with those who suffer.",
        "Slava Ukraini! 🇺🇦 Героям слава!",
        "Freedom for Ukraine! Stop Russian aggression!",
        "Supporting Ukraine means supporting democracy.",
        "Ukrainians fight for their freedom—and ours.",
        "Defend Ukraine, defend freedom!",
        "Never forget Bucha. Never forget Mariupol.",
        "Ukraine will prevail!",
        "Help Ukraine fight for justice and peace.",
        "The world must hold Russia accountable.",
        "Ukrainian resilience inspires us all.",
        "Human rights are non-negotiable. Support Ukraine.",
        "War crimes cannot be ignored. Stand with Ukraine.",
        "United for Ukraine. 🇺🇦",
        "Support Ukraine. Stop Russian imperialism.",
        "Every voice matters. Speak up for Ukraine.",
        "Peace and justice for Ukraine.",
        "Stand with Ukraine. Defend democracy.",
        "Ukrainians fight for their survival. We must help.",
        "History will remember who stood with Ukraine.",
        "A free Ukraine is a free world.",
        "We must stop Russia's aggression—now.",
        "Ukraine fights for all of us.",
        "Hope and strength for Ukraine. 🇺🇦",
        "Truth and justice for Ukraine!",
        "Ukrainian children deserve peace, not war.",
        "Support Ukraine's right to exist.",
        "Democracy must prevail. Stand with Ukraine.",
        "Ukraine is strong. Ukraine will win."
    ];

    return {
        init : function(Args) {
            _args = Args;
            const head = document.getElementsByTagName('HEAD')[0];
            const styleSheet = document.createElement('link');
            styleSheet.rel = 'stylesheet';
            styleSheet.type = 'text/css';
            styleSheet.href = '/assets/css/ukraine.css';
            head.appendChild(styleSheet);
        },

        createBanner : function() {
            let ukraineBanner = document.createElement("div");
            ukraineBanner.classList.add('ukb');

            if (_args[0] === "dark") {
                ukraineBanner.classList.add('ukb-dark');
            } else {
                ukraineBanner.classList.add('ukb-light');
            }

            let message = "";
            if (_args[1] === "random") {
                message = messages[Math.floor(Math.random() * messages.length)];
            } else if (_args[1] === "emoji") {
                message = "❤️ 🇺🇦";
            } else if (_args[1] === "hashtag") {
                message = "#StandWithUkraine";
            } else if (_args[1] === "small") {
                message = "We stand with 🇺🇦 Ukraine #StandWithUkraine";
            } else if (_args[1] === "large") {
                message = "Russia's war against 🇺🇦 Ukraine is real and raw. Our hearts are with those who suffer.";
            }

            ukraineBanner.classList.add(_args[1] === "large" ? 'ukb-large' : 'ukb-small');
            ukraineBanner.appendChild(document.createTextNode(message));

            if (_args[2] === "bottom-right") {
                ukraineBanner.classList.add('ukb-bottom-right');
            } else if (_args[2] === "bottom-left") {
                ukraineBanner.classList.add('ukb-bottom-left');
            } else if (_args[2] === "top-left") {
                ukraineBanner.classList.add('ukb-top-left');
            } else if (_args[2] === "top-right") {
                ukraineBanner.classList.add('ukb-top-right');
            }

            document.body.appendChild(ukraineBanner);

            ukraineBanner.onclick = () => {
                window.location.href = 'https://u24.gov.ua/';
            };
        }
    };
}());

// Example usage with random mode
UKRAINE.init(["dark", "random", "bottom-right"]);
UKRAINE.createBanner();
