console.log("Start");
console.log("--------------------------");

const sdk = window.sdk;

// ==========   Variables   ==========
const BASEURL = "https://quranic.network";

// ========== login with username and password for get access token ==========
//const client = sdk.createClient(BASEURL);

//client.login("m.login.password", {"user": USERID, "password": PASSWORD}).then((response) => {
//	const accessToken = response.access_token;
//	console.log(accessToken);
//});


// ========== login with access token ==========
const client = sdk.createClient({
    baseUrl: BASEURL,
    accessToken: ACCESSTOKEN,
   userId: USERID
});


// ========== call start function ==========
start_matrix_client();


// ========== start function ==========
export function start_matrix_client() {
  client.startClient();
  client.once('sync', function(state, prevState, res) {
	console.log('state ----> ', state);
  });
};


// ========== get rooms list function ==========
export function getRoomsList() {
  var tree = new Array();
  var rooms = client.getRooms();
  //console.log("rooms : ", rooms);
  rooms.forEach(room => {
    var myroom = {"name": room.name, "element_user": room.roomId, "id": room.roomId,"tags": ['معارف# '], "nodeType": 'simple'};
  	//console.log(room.roomId, room.name, room.myUserId, room.members, room._displayNameToUserIds);
  	tree[tree.length] = myroom;
 });
 alert(tree);
 return tree;
};


function getRoombyName(room_name){
var rooms = getRoomsList()
var roomId = ""
if (roomName != "") {
  for (var i=0; i <= rooms.length; i++){
    var room = rooms[i];
    if (room.name === roomName) {
      roomId = room.roomId;
      break;
    }
  };
}
  return roomId;
}


export function send_message(roomIds, content_text) {

    // ============ get room users list ==============================
    //  var members = room.getJoinedMembers();
    //  members.forEach(member => {
    //    console.log(member.name);
    //   });

    // ============= send message function ===========================
    var content = {
      "body": content_text,
      "msgtype": "m.text"
    };
    roomIds.forEach(roomId => {
    client.sendEvent(roomId["element_user"], "m.room.message", content, "").then((res) => {
     // message sent successfully
    }).catch((err) => {
      console.log(err);
    });});
};

export function send_individual_message(rooms, content_text) {

    // ============= send message function ===========================
    var content = {
      "body": content_text,
      "msgtype": "m.text"
    };
    var final_users = new Array();
    var selected_roomIds= rooms.forEach(roomId => {roomId["element_user"]});
    var existing_rooms = getRoomsList();
    existing_rooms.forEach(roomObj => {
    if (selected_roomIds.includes(roomObj.roomId)){
        var curr_members = roomObj.getJoinedMembers();
        curr_members.forEach(member => {
        if (!final_users.includes(member.roomId)){
           final_users[final_users.length] = member.roomId;
           client.sendEvent(member.roomId, "m.room.message", content, "").then((res) => {
            // message sent successfully
            }).catch((err) => {
            console.log(err);
            });
        }
    })}
    })
 };
