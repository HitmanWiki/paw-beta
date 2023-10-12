(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
    ["lx-analytics"], {
        "7d86": function(n, t, o) {
            "use strict";
            o("907a"), o("fa9e"), o("77d9"), o("3c5d"), o("1b3b"), o("3d71"), o("c6e3"),
                function(n) {
                    function t(n = 64) {
                        var t = new Uint8Array(n / 2);
                        const o = window.crypto || window.msCrypto;

                        function i(n) {
                            return n.toString(16).padStart(2, "0")
                        }
                        return o.getRandomValues(t), Array.from(t, i).join("")
                    } {
                        const o = t(16),
                            i = function(t, a) {
                                fetch(n + "actions", {
                                    method: "POST",
                                    headers: {
                                        Accept: "application/json",
                                        "Content-Type": "application/json;charset=utf-8"
                                    },
                                    body: JSON.stringify({
                                        payload: {
                                            event: t,
                                            session_id: o,
                                            user_id: i.user_id,
                                            role_id: i.role_id,
                                            path: window.location.pathname,
                                            eventParams: a
                                        }
                                    })
                                })
                            };
                        i.setGASession = function({
                            cId: t,
                            sId: o,
                            token: i
                        }) {
                            fetch(n + "ga/update", {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json;charset=utf-8",
                                    Authorization: "Bearer " + i
                                },
                                body: JSON.stringify({
                                    payload: {
                                        client_id: t,
                                        session_id: o
                                    }
                                })
                            })
                        }, window["lxAnalytics"] = i, i("init")
                    }
                }("https://analytics.laborx.io/")
        }
    }
]);
//# sourceMappingURL=lx-analytics.354bd677.js.map