//Warning: this script will destroy any existing data in the 21CAv1 database

db.getSiblingDB("21CAv1")
db.dropDatabase()
db.getSiblingDB("21CAv1")

db.createCollection("users")
db.createCollection("servers")
db.createCollection("events")
db.createCollection("claims")

//Update the email addresses to that of your own Google+ and Facebook identities
db.users.save([
{
    "_id": ObjectId("555192c05bdb5729418d020c"),
    "name": "Ming Destiny",
    "userName": "attendee",
    "password": "",
    "role": "ATTENDEE",
    "status": "active",
    "email": "youremail@iinet.net.au"
},
{
    "_id": ObjectId("555192c05bdb5729418d020d"),
    "name": "Super Shiels",
    "userName": "super",
    "password": "",
    "role": "SUPERVISOR",
    "status": "active",
    "email": "youremail@facebook.com"
},
{
    "_id": ObjectId("555192c05bdb5729418d020b"),
    "name": "Admin Judah",
    "userName": "admin",
    "password": "",
    "role": "ADMINISTRATOR",
    "status": "active",
    "email": "youremail@gmail.com"
}
])

db.servers.save([
{
    "_id": ObjectId("5552a645bb11663542b1b4e6"),
    "path": "AU.NSW.IoCS",
    "name": "Diploma of Cue sports @ Institute of Cue Sports",
    "owner": {
        "id": "555192c05bdb5729418d020b",
        "name": "Admin Judah"
    },
    "status": "active"
},
{
    "_id": ObjectId("5552a645bb11663542b1b4e7"),
    "path": "AU.NSW.HD.Masters",
    "name": "Masters of Hair Dressing @ HD",
    "owner": {
        "id": "555192c05bdb5729418d020b",
        "name": "Admin Judah"
    },
    "status": "active"
},
{
    "_id": ObjectId("5552a645bb11663542b1b4e5"),
    "path": "AU.VIC.RMIT.mech-eng",
    "name": "Mechanical Engineering @ RMIT",
    "owner": {
        "id": "555192c05bdb5729418d020b",
        "name": "Admin Judah"
    },
    "status": "active"
}
])

db.events.save([
{
    "_id": ObjectId("5552b2cc0512855b425e204f"),
    "server": {
        "id": "5552a645bb11663542b1b4e7",
        "name": "Masters of Hair Dressing @ HD"
    },
    "name": "Mindless chatter 101",
    "supervisor": {
        "id": "555192c05bdb5729418d020d",
        "name": "Super Shiels"
    },
    "dateTime": "2015-05-25T13:30:00",
    "duration": "90",
    "location": "Building 4, room 104A",
    "status": "active"
},
{
    "_id": ObjectId("5552b2cc0512855b425e204e"),
    "server": {
        "id": "5552a645bb11663542b1b4e5",
        "name": "Mechanical Engineering @ RMIT"
    },
    "name": "Mechanical Engineering 101",
    "supervisor": {
        "id": "555192c05bdb5729418d020d",
        "name": "Super Shiels"
    },
    "dateTime": "2015-05-20T13:30:00",
    "duration": "90",
    "location": "Building 5, room 412",
    "status": "active"
},
{
    "_id": ObjectId("5552b2cc0512855b425e2050"),
    "server": {
        "Id": "5552a645bb11663542b1b4e6",
        "name": "Diploma of Cue sports @ Institute of Cue Sports"
    },
    "name": "Physics of moving bodies",
    "supervisor": {
        "id": "555192c05bdb5729418d020d",
        "name": "Super Shiels"
    },
    "dateTime": "2015-05-30T13:30:00",
    "duration": "90",
    "location": "Lindrum house, room 212B",
    "status": "active"
}
])