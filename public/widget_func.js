console.log("Start");
console.log("--------------------------");

const sdk = window.sdk;

// ==========   Variables   ==========


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
export function getRoomsList(user, pass) {
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




function sendMessage() {
// ========== for test , set specific room name here ==========
var roomName = "";

// ========== get one room from rooms by room name ==========
if (roomName != "") {
  for (var i=0; i <= rooms.length; i++){
    var room = rooms[i];
    if (room.name === roomName) {
      console.log(room.roomId);
      var roomId = room.roomId;
      break; 
    }
  };

// ========== do something in room ==========
  if (roomId != null) {

// ============ get room users list ==============================
//  var members = room.getJoinedMembers();
//  members.forEach(member => {
//    console.log(member.name);
//   });


// ============= send message function ===========================
    var content = {
      "body": "NEW TEST!",
      "msgtype": "m.text"
    };

    client.sendEvent(roomId, "m.room.message", content, "").then((res) => {
     // message sent successfully
    }).catch((err) => {
      console.log(err);
    });
  };
};};
