"use strict";

console.log("js-h5-wsckt");

// Initialize everything when the window finishes loading
window.addEventListener("load", function (event) {
    var status = document.getElementById("status");
    var url = document.getElementById("url");
    var open = document.getElementById("open");
    var close = document.getElementById("close");
    var send = document.getElementById("send");
    var text = document.getElementById("text");
    var message = document.getElementById("message");
    var socket;

    status.textContent = "Not Connected";
    url.value = "ws://localhost:9000";
    close.disabled = true;
    send.disabled = true;

    // Create a new connection when the Connect button is clicked
    open.addEventListener("click", function (event) {
        open.disabled = true;
        url.disabled = true;
        socket = new WebSocket(url.value, "echo-protocol");

        socket.addEventListener("open", function (event) {
            close.disabled = false;
            send.disabled = false;
            status.textContent = "Connected";
        });

        // Display messages received from the server
        socket.addEventListener("message", function (event) {
            //message.textContent = "Server Says: " + event.data;
            add_new_message(event.data);
        });

        // Display any errors that occur
        socket.addEventListener("error", function (event) {
            message.textContent = "Error: " + event;
        });

        socket.addEventListener("close", function (event) {
            open.disabled = false;
            status.textContent = "Not Connected";
        });
    });

    // Close the connection when the Disconnect button is clicked
    close.addEventListener("click", function (event) {
        close.disabled = true;
        url.disabled = false;
        send.disabled = true;
        message.textContent = "";
        socket.close();
    });

    // Send text to the server when the Send button is clicked
    send.addEventListener("click", function (event) {
        socket.send(text.value);
        text.value = "";
    });
});

var add_new_message = function (val) {
    var messages = document.getElementById('messages');

    var li = document.createElement("li");
    var p = document.createTextNode(val);
    li.appendChild(p);
    messages.insertBefore(li, messages.getElementsByTagName("li")[0])

    var last_message = messages.lastChild;
    last_message.parentNode.removeChild(last_message);
    var last_message = document.getElementById('messages').lastChild;
    last_message.parentNode.removeChild(last_message);
};
