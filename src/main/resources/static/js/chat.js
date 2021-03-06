jQuery.each(["put", "delete", "post"], function (i, method) {
    jQuery[method] = function (url, data, callback) {
        if (jQuery.isFunction(data)) {
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: data,
            success: callback,
            error: function (data) {
                console.log("error");
                console.log(data);
            }
        });
    };
});

var global_id;
var global_messages = [];
var isFaceToFaceChatChecked;
var chatter_id;
$(document).ready(function () {
    isActiveUser();
    getAllMessages();
    isFaceToFaceChatChecked = false;
    getChatters();
    (function () {
        var date = new Date();
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var m = date.getMinutes();
        m = m < 10 ? "0" + m : m;
        var s = date.getSeconds();
        s = s < 10 ? "0" + s : s;
        var time = h + ":" + m + ":" + s;
        $("#aT").text(time);
        window.setTimeout(arguments.callee, 1000);

    })();
    setInterval("isChatChanged()", 1000);
    setInterval("isThereAreNewMessages()", 1000);
});

function isAdmin(roles) {
    for (var i = 0; i < roles.length; i++) {
        if (roles[i] === "SUPER_ADMIN" || roles[i] === "ADMIN") {
            return true;
        }
    }
    return false;
}

function isActiveUser() {
    $.get("/active", function (resp) {
        if (resp === "") {
            $(".cabinet").css("display", "none");
            $(".logout").css("display", "none");
            $(".chat_room").css("display", "none");
        } else {
            $(".cabinet").text(user.username);
            $(".login").css("display", "none");
            $(".registration").css("display", "none");
        }
    });
}

function getAllMessages() {
    $.get("/messages", function (resp) {
        $(".messages").empty();
        fillMessages(resp);
    });

}

function isChatChanged() {
    var messagesJson = JSON.stringify(global_messages);
    if(isFaceToFaceChatChecked){
        $.post("/is_private_chat_changed", messagesJson).done(function (resp) {
            if (resp.length > 0) {
               fillPrivateMessages(resp);
            }
        })
    }else{
        $.post("/messages", messagesJson).done(function (resp) {
            if (resp.length > 0) {
                $(".messages").empty();
                fillMessages(resp);
            }
        })
    }
}

function showEdit(name) {
    var usrname = user.username;
    if (usrname == name) {
        $("." + name).css("display", "inline");

    }

}

function showDelete() {
    var roles = user.roles;
    if (isAdmin(roles)) {
        $(".controllersD").css("display", "inline");
    }
}

function editMsg(id) {
    var text = document.getElementById(id).innerText;
    $("#newMessage").val(text);
    $("#sendMessage").css("display", "none");
    $("#changeMessage").css("display", "block")
    global_id = id;
    //isChatChanged()
}

function changeMessage() {
    var text = $("#newMessage").val();
    var msgObject = {
        text: text
    }
    var msgJson = JSON.stringify(msgObject);

    if(isFaceToFaceChatChecked){
    $.put("/change_private_message?msg_id=" + global_id + "&user2_id=" + chatter_id, msgJson).done(function (resp) {
        getPrivetMessages(chatter_id);
        $("#newMessage").val("");
        $("#sendMessage").css("display", "block");
        $("#changeMessage").css("display", "none")
    })
    }else{
        $.put("/msg?id=" + global_id, msgJson).done(function (resp) {
            getAllMessages();
            $("#newMessage").val("");
            $("#sendMessage").css("display", "block");
            $("#changeMessage").css("display", "none")
        })
    }

}

function deleteMsg(id) {

    if(isFaceToFaceChatChecked){
        delete_private_message
        $.delete("/delete_private_message?id=" + id, function (resp) {
            getPrivetMessages(chatter_id);
        })

    }else{
        $.delete("/msg?id=" + id, function (resp) {
            getAllMessages();
        })
    }
}

function sendMessage() {

     var text = $("#newMessage").val();
     var objectText = {
         text: text
     }
     var jsonText = JSON.stringify(objectText);

     if(isFaceToFaceChatChecked){

        $.post("/send_private_message/" + chatter_id, jsonText).done(function (data) {
            $("#newMessage").val("");
            getPrivetMessages(chatter_id);
        });
     }else{
        $.post("/msg", jsonText).done(function (data) {
            $("#newMessage").val("");
            getAllMessages();
        });
    }

}

function fillMessages(messages) {
    normalizationMessages(messages);
    $(".messages").empty();
    for (var i = 0; i < messages.length; i++) {
        var name = messages[i].user.username;
        var usrname = name + ":  ";
        var id = messages[i].id;
        var text = messages[i].text;
        var timeInSeconds = messages[i].epochSecond;
        var date = new Date(timeInSeconds * 1000);
        var day = date.getDate();
        day = day < 10 ? "0" + day : day;
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var year = date.getFullYear();
        var hours = date.getHours();
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var correctDate = day + "." + month + "." + year + " " + hours + ":" + minutes;
        if(user.username===messages[i].user.username){
            $(".messages").append(`<section  class="main_usr_name">${usrname} &nbsp;
                            <a class="main_usr_message" id="${id}">${text}</a>
                            <a class="main_usr_time">${correctDate}</a>
                            <button onclick="deleteMsg(${id})" class="controllersD">&#10008</button>
                            <button onclick="editMsg(${id})" class="${name}" style="display: none;float: right;">&#9998</button>
                            </section>`)
            showEdit(name);
            showDelete();

        }else{
            $(".messages").append(`<section  class="usr_name" >${usrname} &nbsp;
                            <a class="usr_message"  id="${id}">${text}</a>
                            <a class="usr_time">${correctDate}</a>
                            <button onclick="deleteMsg(${id})" class="controllersD">&#10008</button>
                            <button onclick="editMsg(${id})" class="${name}" style="display: none;float: right;">&#9998</button>
                            </section>`)
            showEdit(name);
            showDelete();
        }
    }
}

function normalizationMessages(messages) {
    for (var i = 0; i < messages.length; i++) {
        var id = messages[i].id;
        var text = messages[i].text;
        var tag = messages[i].tag;
        var user_id = messages[i].user.id;
        var username = messages[i].user.username;
        var password = messages[i].user.password;
        var active = messages[i].user.active;
        var email = messages[i].user.email;
        var activationCode = messages[i].user.activationCode;
        var roles = messages[i].user.roles;
        var time = messages[i].createTime;
        var seconds = messages[i].epochSecond;
        var user = {
            id: user_id,
            username: username,
            password: password,
            active: active,
            email: email,
            activationCode: activationCode,
            roles: roles,
        }
        var normMessage = {
            id: id,
            text: text,
            tag: tag,
            user: user,
            createTime: time,
            epochSecond: seconds
        }
        global_messages[i] = normMessage;
    }
}


function normalizationPrivateMessages(messages) {
    for (var i = 0; i < messages.length; i++) {
        var id = messages[i].id;
        var text = messages[i].text;
        var user_id = messages[i].fromUser.id;
        var username = messages[i].fromUser.username;
        var password = messages[i].fromUser.password;
        var active = messages[i].fromUser.active;
        var email = messages[i].fromUser.email;
        var activationCode = messages[i].fromUser.activationCode;
        var roles = messages[i].fromUser.roles;
        var time = messages[i].createTime;
        var seconds = messages[i].epochSecond;
        var isRead = messages[i].isRead;
        var user = {
            id: user_id,
            username: username,
            password: password,
            active: active,
            email: email,
            activationCode: activationCode,
            roles: roles,
        }
        var normMessage = {
            id: id,
            text: text,
            user: user,
            isRead: isRead,
            createTime: time,
            epochSecond: seconds
        }
        global_messages[i] = normMessage;
    }
}

function getChatters(){
    $.get("/get_chatters").done(function(resp){
        fillChatters(resp);
    })

}

function fillChatters(chatters){
    console.log(chatters);

    if(chatters.length > 0){
        for(var i = 0; i < chatters.length; i++){
            var name = chatters[i].username;
            var id = chatters[i].id;

            $(".btn-group").append(`<button class="unCheckedChat"  id="${name}" onclick="moveToOtherChat(${id})" >${name}</button>`)

        }
    }


}

function moveToGeneralChat(){
    var elements = document.getElementsByClassName("checkedChat");
    for(var i = 0; i < elements.length; i++){
        elements[i].className = 'unCheckedChat';
    }
    var target = event.target;
    target.className = 'checkedChat'
    isFaceToFaceChatChecked = false;
    $("#newMessage").val("");
    $("#sendMessage").css("display", "block");
    $("#changeMessage").css("display", "none")

    getAllMessages();
}


function moveToOtherChat(id){
    var elements = document.getElementsByClassName("checkedChat");
    for(var i = 0; i < elements.length; i++){
        elements[i].className = 'unCheckedChat';
    }
    var target = event.target;
    target.className = 'checkedChat'
    chatter_id = id;
    $("#newMessage").val("");
    $("#sendMessage").css("display", "block");
    $("#changeMessage").css("display", "none")

    getPrivetMessages(chatter_id);

}

function getPrivetMessages(id){
    $.get("/get_private_messages?id=" + id).done(function(resp){
         console.log(resp);
         fillPrivateMessages(resp);
         isFaceToFaceChatChecked = true;
    })


}

function addChatter(){
    location = "/add_chatter_page";
}


function fillPrivateMessages(messages){
    normalizationPrivateMessages(messages);
    $(".messages").empty();
    for (var i = 0; i < messages.length; i++) {
        var name = messages[i].fromUser.username;
        var usrname = name + ":  ";
        var id = messages[i].id;
        var text = messages[i].text;
        var timeInSeconds = messages[i].epochSecond;
        var date = new Date(timeInSeconds * 1000);
        var day = date.getDate();
        day = day < 10 ? "0" + day : day;
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var year = date.getFullYear();
        var hours = date.getHours();
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var correctDate = day + "." + month + "." + year + " " + hours + ":" + minutes;
        if(user.username===messages[i].fromUser.username){
            $(".messages").append(`<section  class="main_usr_name">${usrname} &nbsp;
                            <a class="main_usr_message" id="${id}">${text}</a>
                            <a class="main_usr_time">${correctDate}</a>
                            <button onclick="deleteMsg(${id})" class="controllersD">&#10008</button>
                            <button onclick="editMsg(${id})" class="${name}" style="display: none;float: right;">&#9998</button>
                            </section>`)
            showEdit(name);
            showDelete();

        }else{
            $(".messages").append(`<section  class="usr_name" >${usrname} &nbsp;
                            <a class="usr_message"  id="${id}">${text}</a>
                            <a class="usr_time">${correctDate}</a>
                            <button onclick="deleteMsg(${id})" class="controllersD">&#10008</button>
                            <button onclick="editMsg(${id})" class="${name}" style="display: none;float: right;">&#9998</button>
                            </section>`)
            showEdit(name);
            showDelete();
        }

    }
}

function isThereAreNewMessages(){
    $.get("/is_new_messages").done(function(resp){
        updateBtnGroup(resp);
    })
}

function updateBtnGroup(users){
        var btnGroup = document.getElementsByClassName("unCheckedChat");
        var countedUsers = new Map();
        var count;

        for( var i =0; i < users.length; i++){
            count = 0;
            for(var k =0; k < users.length; k++){
                if(users[i].id===users[k].id){
                    count++;
                }
            }
            countedUsers.set(count, users[i]);
        }
        var isAllRead;
        for(var j = 0; j < btnGroup.length; j++){
            isAllRead = true;
            for(var [key, value] of countedUsers){
                if(btnGroup[j].id == value.username){
                    btnGroup[j].innerText = value.username + "   +" + key;
                    isAllRead = false;
                }
            }
            if(isAllRead){
                btnGroup[j].innerText = btnGroup[j].id;
            }
        }

       var currentChat = document.getElementsByClassName("checkedChat");
       currentChat[0].innerText = currentChat[0].id;

}


