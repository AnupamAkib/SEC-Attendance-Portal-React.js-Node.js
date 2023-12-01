var cors = require('cors')
require('dotenv').config()

var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var multer = require('multer');
var md5 = require('md5');
var app = express();
var multer = multer();

app.use(cors());
app.use(bodyParser.json());
app.use(multer.array()); //for parsing multiple/form-data

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server Started");
})

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var URL = "mongodb+srv://anupam:HdqblhYs****ePwo@cluster0.vnrs1.mongodb.net?retryWrites=true&w=majority";

var config = { useUnifiedTopology: true };

MongoClient.connect(URL, config, function (err, myMongoClient) {
    if (err) {
        console.log("connection failed");
    }
    else {
        console.log("connection success");

        //--------------------------------------------------------------------------------
        //############################ SEC Attendance Syatem #############################
        //--------------------------------------------------------------------------------

        let exist, success, empName, dayOff;
        function getWeekDay(d, m, y) {
            let todays_date = m + " " + d + ", " + y;
            const t = new Date(todays_date);
            let todays_day = t.getDay()
            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return weekday[todays_day];
        }
        function daysInMonth(month, year) {
            let m;
            if (month == "January") { m = 1 }
            if (month == "February") { m = 2 }
            if (month == "March") { m = 3 }
            if (month == "April") { m = 4 }
            if (month == "May") { m = 5 }
            if (month == "June") { m = 6 }
            if (month == "July") { m = 7 }
            if (month == "August") { m = 8 }
            if (month == "September") { m = 9 }
            if (month == "October") { m = 10 }
            if (month == "November") { m = 11 }
            if (month == "December") { m = 12 }
            return new Date(year, m, 0).getDate();
        }
        app.post("/SEC/mark", function (req, res) {
            let empID = req.body.empID;
            let status = req.body.status;
            let day = req.body.day;
            let month = req.body.month;
            let year = req.body.year;
            let time = req.body.time;

            //console.log(getWeekDay(day, month, year));
            let collection_name = year + "_" + month;
            //let collection_name = "aaa";

            myMongoClient.db("SEC").collection("employee").find({ empID: empID }).toArray(function (err, rr) { //find() er vitor obj akare condition o apply kora jay. jemon, {ID : "191-35-2640"}
                empName = "";
                dayOff = "";
                if (err) {
                    console.log("Error fetching data");
                }
                else {
                    empName = rr[0].empName
                    dayOff = rr[0].dayOff
                }
            })

            myMongoClient.db("SEC").listCollections().toArray(function (err, coll) {
                exist = false;
                for (let i = 0; i < coll.length; i++) {
                    if (coll[i].name == collection_name) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    myMongoClient.db("SEC").createCollection(collection_name);
                }

                let collection = myMongoClient.db("SEC").collection(collection_name);
                collection.find({ empID: empID }).toArray(function (err, data) { //find() er vitor obj akare condition o apply kora jay. jemon, {ID : "191-35-2640"}
                    if (data.length == 0) {
                        let ar = [];
                        for (let i = 0; i < daysInMonth(month, year); i++) {
                            ar[i] = "-";
                        }
                        let _data = {
                            empID, empName, status: ar
                        }
                        myMongoClient.db("SEC").collection(collection_name).insertOne(_data);
                        data.push(_data);
                    }

                    //NOW SET THE STATUS IN DATA AND UPDATE THAT IN DATABASE
                    //HERE
                    if (status == "Present") {
                        data[0].status[day - 1] = time;
                    }
                    else {
                        data[0].status[day - 1] = status;
                    }


                    myMongoClient.db("SEC").collection(collection_name).updateOne(
                        { empID: empID }, //targeted data
                        {
                            $set: { status: data[0].status }
                        },
                        function (err, r) {
                            success = false;
                            if (err) {
                                //res.send({ status: "failed" })
                            }
                            else {
                                //res.send({ status: "done" })
                                success = true;
                            }
                            let date = day + " " + month + ", " + year;
                            res.send({ empName, empID, success, status, time, date });
                        }
                    )
                })
            });
        })

        app.post("/SEC/checkAttendance", function (req, res) {
            let empID = req.body.empID;
            let day = req.body.day;
            let month = req.body.month;
            let year = req.body.year;

            let collection_name = year + "_" + month;
            myMongoClient.db("SEC").collection(collection_name).find({ empID: empID }).toArray(function (err, r) { //find() er vitor obj akare condition o apply kora jay. jemon, {ID : "191-35-2640"}
                //res.send(r);
                if (r.length == 0) {
                    res.send({ empID, status: "not given" })
                }
                else {
                    if (r[0].status[day - 1] == "-") {
                        res.send({ empID, status: "not given" })
                    }
                    else {
                        res.send({ empID, status: r[0].status[day - 1], date: day + " " + month + ", " + year })
                    }
                }
            })
        })

        app.post("/SEC/allAttendance", function (req, res) {
            let month = req.body.month;
            let year = req.body.year;
            let collection_name = year + "_" + month;
            var collection = myMongoClient.db("SEC").collection(collection_name);
            collection.find().toArray(function (err, data) {
                if (err) {
                    console.log("Error selecting data");
                    res.send({ result: "failed" });
                }
                else {
                    res.send({ result: "done", month: month + ", " + year, data: data });
                }
            })
        })

        app.post("/SEC/SEC_login", function (req, res) {
            let empID = req.body.empID;
            let password = req.body.password;
            var collection = myMongoClient.db("SEC").collection("employee");
            collection.find({ empID: empID }).toArray(function (err, data) {
                if (err) {
                    console.log("Error selecting data");
                    res.send({ result: "failed" });
                }
                else {
                    if (data.length != 0) {
                        if (data[0].password == password) {
                            res.send({
                                result: "done",
                                empName: data[0].empName,
                                dayOff: data[0].dayOff,
                                showroom_name: data[0].showroom_name,
                                latitude: data[0].latitude,
                                longitude: data[0].longitude,
                                range: data[0].range
                            });
                        }
                        else {
                            res.send({ result: "not matched" });
                        }
                    }
                    else {
                        res.send({ result: "not matched" });
                    }
                }
            })
        })

        app.post("/SEC/addEmployee", function (req, res) {
            let empName = req.body.empName;
            let empID = req.body.empID;
            let password = req.body.password;
            let dayOff = req.body.dayOff;
            let showroom_name = req.body.showroom_name;
            let latitude = req.body.latitude;
            let longitude = req.body.longitude;
            let range = req.body.range;

            var collection = myMongoClient.db("SEC").collection("employee");
            collection.find({ empID: empID }).toArray(function (err, data) {
                if (err) {
                    console.log("Error selecting data");
                    res.send({ result: "failed" });
                }
                else {
                    if (data.length == 0) {
                        //add
                        let employeeData = {
                            empName, empID, password, dayOff, showroom_name, latitude, longitude, range
                        }
                        myMongoClient.db("SEC").collection("employee").insertOne(employeeData);
                        res.send({ result: "done", empID });
                    }
                    else {
                        res.send({ result: "empID already exist" });
                    }
                }
            })
        })

        app.post("/SEC/editEmployee", function (req, res) {
            let empName = req.body.empName;
            let empID = req.body.empID;
            let password = req.body.password;
            let dayOff = req.body.dayOff;
            let showroom_name = req.body.showroom_name;
            let latitude = req.body.latitude;
            let longitude = req.body.longitude;
            let range = req.body.range;

            myMongoClient.db("SEC").collection("employee").updateOne(
                { empID: empID }, //targeted data
                {
                    $set: {
                        empName: empName,
                        password: password,
                        dayOff: dayOff,
                        showroom_name: showroom_name,
                        latitude: latitude,
                        longitude: longitude,
                        range: range
                    }
                },
                function (err, r) {
                    res.send({ empName, empID, password, dayOff, showroom_name, latitude, longitude, range });
                }
            )
        })

        app.post("/SEC/removeEmployee", function (req, res) {
            let empID = req.body.empID;
            var collection = myMongoClient.db("SEC").collection("employee");
            collection.deleteOne(
                { empID: empID }, //targeted data
                function (err, data) {
                    if (err) {
                        res.send({ result: "failed" })
                    }
                    else {
                        res.send({ result: "done" })
                    }
                }
            )
        })

        app.post("/SEC/getAllEmployee", function (req, res) {
            var collection = myMongoClient.db("SEC").collection("employee");
            collection.find().toArray(function (err, data) {
                if (err) {
                    console.log("Error selecting data");
                    res.send({ result: "failed" });
                }
                else {
                    if (data.length == 0) {
                        res.send({ result: "no employee" });
                    }
                    else {
                        res.send({ result: "found", data });
                    }
                }
            })
        })

        let prevData = [];
        app.post("/SEC/editAttendanceIndividual", function (req, res) {
            let empID = req.body.empID;
            let day = req.body.day;
            let month = req.body.month;
            let year = req.body.year;
            let new_status = req.body.new_status;
            let collection_name = year + "_" + month;
            let collection = myMongoClient.db("SEC").collection(collection_name);
            collection.find({ empID: empID }).toArray(function (err, data) {
                prevData = data[0].status;
                prevData[day - 1] = new_status;
                //res.send(prevData)
                myMongoClient.db("SEC").collection(collection_name).updateOne(
                    { empID: empID }, //targeted data
                    {
                        $set: {
                            status: prevData
                        }
                    },
                    function (err, r) {
                        res.send({ result: "done" });
                    }
                )
            })
        })

        app.post("/SEC/change_Password", function (req, res) {
            let empID = req.body.empID;
            let new_password = req.body.new_password;

            myMongoClient.db("SEC").collection("employee").updateOne(
                { empID: empID }, //targeted data
                {
                    $set: {
                        password: new_password
                    }
                },
                function (err, r) {
                    res.send({ result: "done" });
                }
            )
        })

        app.post("/SEC/showRoomLocation", function (req, res) {
            var collection = myMongoClient.db("SEC").collection("admin");
            collection.find().toArray(function (err, data) {
                if (err) {
                    console.log("Error selecting data");
                    res.send({ result: "failed" });
                }
                else {
                    res.send(data);
                }
            })
        })

        app.post("/SEC/change_showroom_location", function (req, res) {
            let latitude = req.body.latitude;
            let longitude = req.body.longitude;
            let range = req.body.range;
            var ObjectId = require('mongodb').ObjectId;
            let id = new ObjectId(req.body.id);

            myMongoClient.db("SEC").collection("admin").updateOne(
                { _id: id }, //targeted data
                {
                    $set: {
                        latitude: latitude,
                        longitude: longitude,
                        range: range
                    }
                },
                function (err, r) {
                    res.send({ result: "done" });
                }
            )
        })

        app.post("/SEC/add_activity", function (req, res) {
            const _data = req.body;
            try {
                myMongoClient.db("SEC").collection("activity").insertOne(_data);
                res.send({ result: "done" })
            }
            catch (e) {
                console.log(e)
                res.send({ result: "failed" })
            }
        })

        app.post("/SEC/view_activity", function (req, res) {
            var collection = myMongoClient.db("SEC").collection("activity");
            collection.find().toArray(function (err, data) {
                if (err) {
                    console.log("Error selecting data");
                    res.send({ result: "failed" });
                }
                else {
                    res.send(data);
                }
            })
        })

    }
})

app.get("/", function (req, res) {
    res.send("<div style='padding: 25px 5px 20px 5px; font-family:arial'><meta name='viewport' content='width=device-width, initial-scale=1.0'><center><img src='https://www.pngkit.com/png/full/816-8161545_freefire-sticker-garena-free-fire-logo-png.png' width='200'/><h1>Flash server running</h1></center></div>");
})
