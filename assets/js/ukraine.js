var UKRAINE = UKRAINE || (function () {
    "use strict";

    const DEFAULT_DISPLAY_PERIOD = 10_000;
    const FADE_DURATION = 1_000;

    let _args = [
        "light",
        "small",
        "bottom-right",
        DEFAULT_DISPLAY_PERIOD
    ];

    const messages = [
        "We stand with Ukraine against Russian aggression. 🇺🇦",
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
        "A free Ukraine strengthens the free world.",
        "We must stop Russia's aggression—now.",
        "Ukraine fights for all of us.",
        "Hope and strength for Ukraine. 🇺🇦",
        "Truth and justice for Ukraine!",
        "Ukrainian children deserve peace, not war.",
        "Support Ukraine's freedom and sovereignty.",
        "Democracy must prevail. Stand with Ukraine.",
        "Ukraine is strong. Ukraine will win."
    ];

    const fixedMessages = {
        emoji: "❤️ 🇺🇦",
        hashtag: "#StandWithUkraine",
        small: "We stand with Ukraine against Russian aggression. 🇺🇦",
        large: "Russia's war against 🇺🇦 Ukraine is real and raw. Our hearts are with those who suffer."
    };

    function getMessage(mode) {
        if (mode === "random") {
            return messages[
                Math.floor(Math.random() * messages.length)
            ];
        }

        return fixedMessages[mode] || fixedMessages.small;
    }

    return {
        init: function (args = []) {
            const requestedPeriod = Number(args[3]);

            _args = [
                args[0] === "dark" ? "dark" : "light",
                args[1] || "small",
                args[2] || "bottom-right",
                Number.isFinite(requestedPeriod)
                    ? Math.max(requestedPeriod, 1_000)
                    : DEFAULT_DISPLAY_PERIOD
            ];

            if (!document.querySelector("link[data-ukraine-banner]")) {
                const styleSheet = document.createElement("link");

                styleSheet.rel = "stylesheet";
                styleSheet.href = "/assets/css/ukraine.css";
                styleSheet.dataset.ukraineBanner = "true";

                document.head.appendChild(styleSheet);
            }
        },

        createBanner: function () {
            if (!document.body) {
                throw new Error(
                    "UKRAINE.createBanner() must be called after document.body exists."
                );
            }

            const existingBanner = document.querySelector(".ukb");

            if (existingBanner) {
                existingBanner.remove();
            }

            const [theme, mode, position, displayPeriod] = _args;
            const message = getMessage(mode);
            const ukraineBanner = document.createElement("a");

            ukraineBanner.classList.add(
                "ukb",
                theme === "dark" ? "ukb-dark" : "ukb-light",
                `ukb-${position}`
            );

            const isLarge =
                mode === "large" ||
                (mode === "random" && message.length > 60);

            ukraineBanner.classList.add(
                isLarge ? "ukb-large" : "ukb-small"
            );

            ukraineBanner.href = "https://u24.gov.ua/";
            ukraineBanner.textContent = message;

            ukraineBanner.setAttribute(
                "aria-label",
                `${message} Visit United24, the official Ukrainian fundraising platform.`
            );

            document.body.appendChild(ukraineBanner);

            let fadeTimer = null;
            let removalTimer = null;

            function cancelFade() {
                window.clearTimeout(fadeTimer);
                window.clearTimeout(removalTimer);

                fadeTimer = null;
                removalTimer = null;

                ukraineBanner.classList.remove("ukb-fade-out");
            }

            function scheduleFade() {
                cancelFade();

                fadeTimer = window.setTimeout(() => {
                    ukraineBanner.classList.add("ukb-fade-out");

                    removalTimer = window.setTimeout(() => {
                        ukraineBanner.remove();
                    }, FADE_DURATION);
                }, displayPeriod);
            }

            ukraineBanner.addEventListener(
                "mouseenter",
                cancelFade
            );

            ukraineBanner.addEventListener(
                "mouseleave",
                scheduleFade
            );

            ukraineBanner.addEventListener(
                "focus",
                cancelFade
            );

            ukraineBanner.addEventListener(
                "blur",
                scheduleFade
            );

            scheduleFade();
        }
    };
}());

UKRAINE.init([
    "dark",
    "small",
    "bottom-right"
]);

UKRAINE.createBanner();