/*
Script Reference Guide:
Property of Quevera LLC
@author Tyler Jenkins 
@date 11-30-20
POC -> Tyler Jenkins, tyler.jenkins@Quevera.com

worldClock(hrsDiff, minsDiff, region, representation):
    Parameters:

    hrsDiff -> Integer, hours difference from GMT, timezone
    minsDiff -> Integer, minutes different from the GMT, usually 0 but in some cases, such as Afghanistan which is 30 minutes, could be a number 
    region -> String, region for determining DST. Some countries do not have DST, like Afghanistan. If a country observes DST, select the region from the 
    list of regions (List 1) below that most closely fits the countries region. For example, Gaza is not in Israel but it Observes the same DST as Israel so 
    "Israel" is passed in for the region parameter when determininbg the time for Gaza. If the local time of a client wants to be displayed enter "Local" as the region
    representation -> Integer, How the time is displayed. Current formats, with their assosciated representation value, are showed in the List of Representations below 
    (List 2)

    Purpose / Functionality / Details:

    Display the time and date of specified countries and states. Automatically takes into account DST and leap years ensuring no further maintainance is needed. Code 
    accounts for a client's local time by using region == "Local"

    Approximately 249 sloc. 
    Run Time -> O(1)

    ----- List of Regions Supported(List 1)-----
    1) North America ("NAmerica")
    2) Europe ("Europe")
    3) Israel ("Israel")
    4) Baghdad ("Baghdad")
    5) Australia ("Australia")
    6) Local ("Local") -> Note: This regions represents the local time of a client, hrsDiff and minsDiff can be any number, recommended is 0 for both
    *Note -> Beirut, Cairo, South America can be added upon request, not included here to keep code lightweight

    ----- Representations (List 2)-----
    1:
    mm/dd/yyyy
    current time with seconds

    2: 
    Month Day Year
    current time with seconds

    3: 
    current time with second

    4: 
    current time without seconds

worldClockZone() 

    Parameters:

    None

    Purpose / Functionality / Details:
    
    Grabs HTML document, where script is located, by Id and injects the string called by the specified country. This can be modified or taken out as it 
    applies to a specific way of injecting the string into an HTML document. 

    Approximately 40 sloc. 
    Run Time -> O(1)

    Important Notes About This Specific Function: 
    1) doocument.getElementById must appear in the order it is called in the HTML. For example Zulu1 has to be the first Id requested in the HTML document.
    If any element Id is here and not in the HTML document (or vice versus) or out of order, program crashes.
*/
function worldClock(hrsDiff, minsDiff, region, representation) {

    var dst = 0 //used to determine if a country is in DST
    var time = new Date() //current time
    var gmtMS = time.getTime() + (time.getTimezoneOffset() * 60000) //gets gmt timezone offset
    var gmtTime = new Date(gmtMS) //sets gmt time based off the offset above
    if (region == "Local") {
        var day = time.getDate() //gets the day
        var month = time.getMonth() //gets the month, as a number
        var year = time.getYear() //gets the year 
        var hr = time.getHours()
        var min = time.getMinutes()
        var sec = time.getSeconds()
    } else {
        var day = gmtTime.getDate() //gets the day
        var month = gmtTime.getMonth() //gets the month, as a number
        var year = gmtTime.getYear() //gets the year 
        var minSub = gmtTime.getMinutes() + minsDiff //gmt time plus minutes offset of zone
        var hrAdd = gmtTime.getHours() + hrsDiff //gmt time plus hours offset of zone

        while (minSub >= 60) { //run through and make sure mins aren't equal or above 60 and increment hours based on mins
            minSub = minSub - 60;
            hrAdd = hrAdd + 1;
        }

        var hr = hrAdd //current hour, given offsets 
        var min = minSub //current minutes, given offsets  
        var sec = gmtTime.getSeconds() //current seconds, should be normal GMT seconds
    }
    if (year < 1000) { //ensures consistancy and edge cases are covered
        year += 1900
    }

    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December") // Array for the months, used throughout the program

    var monthDict = { //Dictionary used to convert numbers to months, for display purposes
        "January": "1",
        "February": "2",
        "March": "3",
        "April": "4",
        "May": "5",
        "June": "6",
        "July": "7",
        "August": "8",
        "September": "9",
        "October": "10",
        "November": "11",
        "December": "12"
    }

    var monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31") //number of days per month, starting at january 
    if (year % 4 == 0) {
        monthDays = new Array("31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31") //mumber of days in a normal year
    }

    if (year % 100 == 0 && year % 400 != 0) {
        monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31") //number of days in a leap year
    }

    //Formatting of seconds, minutes, hours
    if (hr >= 24) {
        hr = hr - 24
        day -= -1 //addition to day, given a consistant syntax
    }
    if (hr < 0) {
        hr -= -24
        day -= 1
    }
    if (hr < 10) {
        hr = "0" + hr //adds a zero for easier 24 hour time display
    }
    if (min < 10) { //adds minutes formatting
        min = "0" + min
    }
    if (sec < 10) { //adds second formatting
        sec = "0" + sec
    }
    if (day <= 0) { //resets year based on month and days
        if (month == 0) {
            month = 11
            year -= 1
        } else {
            month = month - 1
        }
        day = monthDays[month]
    }
    if (day > monthDays[month]) { //resets year based month and days
        day = 1
        if (month == 11) {
            month = 0
            year -= -1
        } else {
            month -= -1
        }
    }
    if (region != "Local") {
        if (region == "NAmerica") { //DST for North America region
            var startDST = new Date()
            var endDST = new Date()
            startDST.setMonth(3)
            startDST.setHours(2)
            startDST.setDate(1)
            var dayDST = startDST.getDay()
            if (dayDST != 0) {
                startDST.setDate(8 - dayDST)
            } else {
                startDST.setDate(1)
            }
            endDST.setMonth(9)
            endDST.setHours(1)
            endDST.setDate(31)
            dayDST = endDST.getDay()
            endDST.setDate(31 - dayDST)
            var currentTime = new Date()
            currentTime.setMonth(month)
            currentTime.setYear(year)
            currentTime.setDate(day)
            currentTime.setHours(hr)
            if (currentTime >= startDST && currentTime < endDST) {
                dst = 1
            }
        } else if (region == "Europe") { //DST for European region
            var startDST = new Date()
            var endDST = new Date()
            startDST.setMonth(2)
            startDST.setHours(1)
            startDST.setDate(31)
            var dayDST = startDST.getDay()
            startDST.setDate(31 - dayDST)
            endDST.setMonth(9)
            endDST.setHours(0)
            endDST.setDate(31)
            dayDST = endDST.getDay()
            endDST.setDate(31 - dayDST)
            var currentTime = new Date()
            currentTime.setMonth(month)
            currentTime.setYear(year)
            currentTime.setDate(day)
            currentTime.setHours(hr)
            if (currentTime >= startDST && currentTime < endDST) {
                dst = 1
            }
        } else if (region == "Israel") { //DST for Israel region 
            var startDST = new Date()
            var endDST = new Date()
            startDST.setMonth(3)
            startDST.setHours(2)
            startDST.setDate(1)
            endDST.setMonth(8)
            endDST.setHours(2)
            endDST.setDate(25)
            dayDST = endDST.getDay()
            if (dayDST != 0) {
                endDST.setDate(32 - dayDST)
            } else {
                endDST.setDate(1)
                endDST.setMonth(9)
            }
            var currentTime = new Date()
            currentTime.setMonth(month)
            currentTime.setYear(year)
            currentTime.setDate(day)
            currentTime.setHours(hr)
            if (currentTime >= startDST && currentTime < endDST) {
                dst = 1
            }
        } else if (region == "Baghdad") { // DST for Baghdad region 
            var startDST = new Date()
            var endDST = new Date()
            startDST.setMonth(3)
            startDST.setHours(3)
            startDST.setDate(1)
            endDST.setMonth(9)
            endDST.setHours(3)
            endDST.setDate(1)
            dayDST = endDST.getDay()
            var currentTime = new Date()
            currentTime.setMonth(month)
            currentTime.setYear(year)
            currentTime.setDate(day)
            currentTime.setHours(hr)
            if (currentTime >= startDST && currentTime < endDST) {
                dst = 1
            }
        } else if (region == "Australia") { //DST for Australian region 
            var startDST = new Date()
            var endDST = new Date()
            startDST.setMonth(9)
            startDST.setHours(2)
            startDST.setDate(31)
            var dayDST = startDST.getDay()
            startDST.setDate(31 - dayDST)
            endDST.setMonth(2)
            endDST.setHours(2)
            endDST.setDate(31)
            dayDST = endDST.getDay()
            endDST.setDate(31 - dayDST)
            var currentTime = new Date()
            currentTime.setMonth(month)
            currentTime.setYear(year)
            currentTime.setDate(day)
            currentTime.setHours(hr)
            if (currentTime >= startDST || currentTime < endDST) {
                dst = 1
            }
        }
    }
    //If a given time is in DST, update the dates and times automatically 
    if (dst == 1) {
        hr -= -1
        if (hr >= 24) {
            hr = hr - 24
            day -= -1
        }
        if (hr < 10) {
            hr = " " + hr
        }
        if (day > monthDays[month]) {
            day = 1
            if (month == 11) {
                month = 0
                year -= -1
            } else {
                month -= -1
            }
        }
    }
    //----- Strings Returned from Function -----\\
    if (dst == 1) {
        if (representation == 1) {
            return monthDict[monthArray[month]] + "/" + day + "/" + year + "<br>" + hr + ":" + min + ":" + sec + " DST"
        } else if (representation == 2) {
            return monthArray[month] + " " + day + " " + year + "<br>" + hr + ":" + min + ":" + sec + " DST"
        } else if (representation == 3) {
            return hr + ":" + min + ":" + sec + " DST"
        } else {
            return hr + ":" + min + " DST"
        }
    } else {
        if (representation == 1) {
            return monthDict[monthArray[month]] + "/" + day + "/" + year + "<br>" + hr + ":" + min + ":" + sec
        } else if (representation == 2) {
            return monthArray[month] + " " + day + " " + year + "<br>" + hr + ":" + min + ":" + sec
        } else if (representation == 3) {
            return hr + ":" + min + ":" + sec
        } else {
            return hr + ":" + min
        }
    }
}

//----- Keeps updating times every 1 second -----\\
function worldClockZone() {
    //----------First Representations----------\\
    document.getElementById("Zulu1").innerHTML = worldClock(0, 0, "Greenwich", 1,)
    document.getElementById("SouthKorea1").innerHTML = worldClock(9, 0, "Tokyo", 1)
    document.getElementById("Afghanistan1").innerHTML = worldClock(4, 30, "Afghanistan", 1)
    document.getElementById("Iraq1").innerHTML = worldClock(3, 0, "Baghdad", 1)
    document.getElementById("Gaza1").innerHTML = worldClock(2, 0, "Israel", 1)
    document.getElementById("Germany1").innerHTML = worldClock(2, 0, "Europe", 1)
    document.getElementById("NSAW1").innerHTML = worldClock(-5, 0, "NAmerica", 1)
    document.getElementById("Denver1").innerHTML = worldClock(-7, 0, "NAmerica", 1)
    document.getElementById("Local1").innerHTML = worldClock(0, 0, "Local", 1)

    //----------Second Representations----------\\
    document.getElementById("Zulu2").innerHTML = worldClock(0, 0, "Greenwich", 2)
    document.getElementById("SouthKorea2").innerHTML = worldClock(9, 0, "Tokyo", 2)
    document.getElementById("Afghanistan2").innerHTML = worldClock(4, 30, "Afghanistan", 2)
    document.getElementById("Iraq2").innerHTML = worldClock(3, 0, "Baghdad", 2)
    document.getElementById("Gaza2").innerHTML = worldClock(2, 0, "Israel", 2)
    document.getElementById("Germany2").innerHTML = worldClock(2, 0, "Europe", 2)
    document.getElementById("NSAW2").innerHTML = worldClock(-5, 0, "NAmerica", 2)
    document.getElementById("Denver2").innerHTML = worldClock(-7, 0, "NAmerica", 2)
    document.getElementById("Local2").innerHTML = worldClock(0, 0, "Local", 2)

    //----------Third Representations----------\\
    document.getElementById("Zulu3").innerHTML = worldClock(0, 0, "Greenwich", 3)
    document.getElementById("SouthKorea3").innerHTML = worldClock(9, 0, "Tokyo", 3)
    document.getElementById("Afghanistan3").innerHTML = worldClock(4, 30, "Afghanistan", 3)
    document.getElementById("Iraq3").innerHTML = worldClock(3, 0, "Baghdad", 3)
    document.getElementById("Gaza3").innerHTML = worldClock(2, 0, "Israel", 3)
    document.getElementById("Germany3").innerHTML = worldClock(1, 0, "Europe", 3)
    document.getElementById("NSAW3").innerHTML = worldClock(-5, 0, "NAmerica", 3)
    document.getElementById("Denver3").innerHTML = worldClock(-7, 0, "NAmerica", 3)
    document.getElementById("Local3").innerHTML = worldClock(0, 0, "Local", 3)

    //----------Fourth Representations----------\\
    document.getElementById("Zulu4").innerHTML = worldClock(0, 0, "Greenwich", 4)
    document.getElementById("SouthKorea4").innerHTML = worldClock(9, 0, "Tokyo", 4)
    document.getElementById("Afghanistan4").innerHTML = worldClock(4, 30, "Afghanistan", 4)
    document.getElementById("Iraq4").innerHTML = worldClock(3, 0, "Baghdad", 4)
    document.getElementById("Gaza4").innerHTML = worldClock(2, 0, "Israel", 4)
    document.getElementById("Germany4").innerHTML = worldClock(1, 0, "Europe", 4)
    document.getElementById("NSAW4").innerHTML = worldClock(-5, 0, "NAmerica", 4)
    document.getElementById("Denver4").innerHTML = worldClock(-7, 0, "NAmerica", 4)
    document.getElementById("Local4").innerHTML = worldClock(0, 0, "Local", 4)

    setTimeout("worldClockZone()", 1000)
}
window.onload = worldClockZone;