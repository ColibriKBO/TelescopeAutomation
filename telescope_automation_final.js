
var SUP;

String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

var curTarget = null;

// Function to turn tracking off. Liberated from BJD scripts.
function trkOff()
{
    if (Telescope.CanSetTracking)
    {
        Telescope.Tracking = false;
        Console.PrintLine("--> Tracking is turned off.");
    }
}

function trkOn()
{
    if (Telescope.CanSetTracking)
    {
        Telescope.Tracking = true;
        Console.PrintLine("--> Tracking is turned on :-)");
    }
}

function openDome()
{
    switch (Dome.ShutterStatus)
    {
        // Dome is open
        case 0:
        Console.PrintLine("--> Dome shutter is already open :-P");
        break;

        // Dome is closed
        case 1:
        Console.PrintLine("--> Dome shutter is closed.");
        Dome.OpenShutter();
        Util.WaitForMilliseconds(500);

        while (Dome.ShutterStatus == 2)
        {
            Console.PrintLine("*** Dome shutter is opening...");
            Util.WaitForMilliseconds(2000);
        }

        if (Dome.ShutterStatus == 0)
        {
            Console.PrintLine("--> Dome shutter is open...");
        }
        else
            Console.PrintLine("--> Dome is NOT open.");
        break;

        case 2:
        while (Dome.ShutterStatus == 2)
        {
            Console.PrintLine("*** Dome shutter is open...");
            Util.WaitForMilliseconds(2000);
        }
        Console.PrintLine("--> Dome shutter is opened...");
        break;

        // Dome is closing. Let it close and then open it.
        case 3:
        while (Dome.ShutterStatus ==3)
        {
            Console.PrintLine("*** Dome shutter is closing. Waiting for it close...");
            Util.WaitForMilliseconds(2000);
        }
        
        Dome.OpenShutter();
        Util.WaitForMilliseconds(500);

        while (Dome.ShutterStatus == 2)
        {
            Console.PrintLine("*** Dome Shutter is opening.");
            Util.WaitForMilliseconds(2000);
        }
        Console.PrintLine("--> Dome shutter is open...");
        break;

        // Houston, we have a problem.
        case 4:
        Console.PrintLine("There was a problem with the shutter control...")
        break;
    }

    // Home the dome if not already done.
    if (!Dome.AtHome)
    {
        Dome.FindHome();
        while (!Dome.AtHome)
        {
            Console.PrintLine("*** Homing dome...");
            Util.WaitForMilliseconds(2000);
        }
        Console.PrintLine("--> Dome is homed... Bigly.");
    }
    
}

function closeDome()
{
    switch (Dome.ShutterStatus)
    {
        //////////////////
        // Dome is open //
        //////////////////
        case 0:
        Console.PrintLine("--> Dome shutter is open.");
        Dome.CloseShutter();
        Util.WaitForMilliseconds(4000);

        while (Dome.ShutterStatus == 3)
        {
            Console.PrintLine("*** Dome shutter is closing...");
            Util.WaitForMilliseconds(2000);
        }

        // while (Dome.ShutterStatus == 2)
        // {
        //  Console.PrintLine("*** Dome shutter is opening...");
        //  Util.WaitForMilliseconds(2000);
        // }

        if (Dome.ShutterStatus == 0)
        {
            Console.PrintLine("--> Dome shutter is open...");
            
        }
        else
            Console.PrintLine("--> Dome is NOT open.");
        break;

        ////////////////////
        // Dome is closed //
        ////////////////////
        case 1:
        Console.PrintLine("--> Dome shutter is already closed :-P");
        break;

        ////////////////////////
        // Shutter is opening //
        ////////////////////////
        case 2:
        while (Dome.ShutterStatus == 2)
        {
            Console.PrintLine("*** Dome shutter is opening...");
            Util.WaitForMilliseconds(2000);
        }
        Console.PrintLine("--> Dome shutter is opened...");
        Util.WaitForMilliseconds(500);

        Dome.CloseShutter();
        Util.WaitForMilliseconds(4000);

        while (Dome.ShutterStatus == 3)
        {
            Console.PrintLine("*** Dome shutter is closing...");
            Util.WaitForMilliseconds(2000);
        }
        break;

        /////////////////////////////////////////////////////
        // Dome is closing. Let it close and then open it. //
        /////////////////////////////////////////////////////
        case 3:
        while (Dome.ShutterStatus ==3)
        {
            Console.PrintLine("*** Dome shutter is closing. Waiting for it close...");
            Util.WaitForMilliseconds(2000);
        }
        Console.PrintLine("--> Dome shutter is closed...");
        break;

        /////////////////////////////////
        // Houston, we have a problem. //
        /////////////////////////////////
        case 4:
        Console.PrintLine("There was a problem with the shutter control...")
        break;
    }
}

function homeDome()
{
    ////////////////////////////////////////
    // Home the dome if not already done. //
    ////////////////////////////////////////
    if (!Dome.AtHome)
    {
        Util.WaitForMilliseconds(2000);

        Dome.FindHome();

        while (!Dome.AtHome)
        {
            Console.PrintLine("*** Homing dome...");
            Util.WaitForMilliseconds(2000);
        }
        Console.PrintLine("--> Dome is homed... Bigly.");
    }
}

function getRADEC()
{
    var ras, des;
    if(Prefs.DoLocalTopo)                               // Get scope J2000 RA/Dec
    {
        SUP.LocalTopocentricToJ2000(Telescope.RightAscension, Telescope.Declnation);
        ras = SUP.J2000RA;
        des = SUP.J2000Dec;
    }
    else
    {
        ras = Telescope.RightAscension;
        des = Telescope.Declination;
    }

    return {ra: ras, dec: des};
}

function gotoRADec(ra, dec)
{
    Console.Printline(Telescope.tracking);
    Console.Printline("RA in gotoRADec function " + ra.toFixed(4));
    Console.Printline("Dec in gotoRADec function " + dec);
    Console.Printline("Elevation of field " + ct.Elevation.toFixed(4));
    if (Telescope.tracking)
    {
        //Console.Printline(ra, dec);
        Console.PrintLine(Telescope.Slewing);

        Console.Printline("Slewing to declination " + dec + "and right ascension " + ra.toFixed(4));
        //Telescope.SlewToCoordinates(8.658, 19.474);
        Telescope.SlewToCoordinates(ra, dec);
         while (Telescope.Slewing)
        {
            Console.PrintLine("Going to...");
            Util.WaitForMilliseconds(500);
        }
        Console.PrintLine("Done.");
        //Console.Printline("Telescope slewing works");
        Util.WaitForMilliseconds(100);
        Console.Printline("Telescope slewed");
        Console.PrintLine(Telescope.Slewing);

       

    }
}

function gotoAltAz(alt, az)
{
    if (Telescope.tracking)
    {
        //Console.PrintLine(Telescope.Slewing);

        Telescope.SlewToAltAz(alt, az);
        Util.WaitForMilliseconds(100);

        //Console.PrintLine(Telescope.Slewing);

        while (Telescope.Slewing)
        {
            Console.PrintLine("Going to...");
            Util.WaitForMilliseconds(2000);
        }
        Console.PrintLine("Done.");

    }
}

// change directory name to date of collection in both bias and frame
function biasCollection() {
    var tid;

    Console.PrintLine("Starting bias frame collection...");
    tid = Util.ShellExec("ColibriGrab.exe", "-n 50 -p Bias_25ms -e 25 -t 0 -f dark -w D:\\ColibriData\\29032021\\Bias");
    Console.printline(tid)

    while (Util.IsTaskActive(tid)) {
        Util.WaitForMilliseconds(50);

        Console.PrintLine("Collecting bias frames...")
    }

    Util.ShellExec("taskkill.exe", "/im ColibriGrab.exe /t /f");
    Console.PrintLine("Finished bias frames...");
}

/*
function weatherCheck() {
    var bool = Weather.Available;
    var safe = Weather.Safe;
    Console.Printline(safe);
    //Console.Printline(bool == True);
    Console.Printline(bool);
    //console.printline(Weather.Available);
    //Console.Printline(Weather.Safe);
    //Console.Printline(Weather.Clouds);
    if (bool && safe) {
        //cloud_cover = Weather.Clouds;
        //var cloud_cover = Weather.Clouds;
        Console.Printline(Weather.Clouds);
        Console.Printline(Weather.Precipitation);
        Console.Printline(Weather.RelativeHumidity);
        Console.Printline(Weather.WindVelocity);
        
        if (Weather.Clouds > 0.2) { // condition might change 
            //Console.Printline("Clouds = ", Weather.Clouds);
            trkOff();
            closeDome();
            Dome.Park();
            Telescope.Park();
            Util.AbortScript();
        }
        //precipitation = Weather.Precipitation
        if (Weather.Precipitation == 'True') {
            //Console.Printline("Precipitation = ", Weather.Precipitation);
            trkOff();
            closeDome();
            Dome.Park();
            Telescope.Park();
            Util.AbortScript();
        }
        if (Weather.RelativeHumidity > 0.9) {
            //Console.Printline("Humidity = ", Weather.RelativeHumidity); 
            trkOff();
            closeDome();
            Dome.Park();
            Telescope.Park();
            Util.AbortScript();
        }
        if (Weather.WindVelocity > 30) {
            //Console.Printline("Wind Velocity = ", Weather.WindVelocity);
            trkOff();
            closeDome();
            Dome.Park();
            Telescope.Park();
            Util.AbortScript();
        }
        Console.Printline("All weather conditions met. Moving to observations.")
        // code conditions for wind velocity and direction 
    } else {
        Console.Printline("There is a problem with the weather server.");
    }
}
*/


function nauticalTwilight() {
/*
    switch (Dome.ShutterStatus) {
        case 0:
            if (Dome.ShutterStatus == 0) {
                Console.PrintLine("Dome shutter still open.")
                Util.WaitForMilliseconds(1000);
                weatherCheck();
                main();
                break;
            }
        case 1:
            if (Dome.ShutterStatus == 1) {
                trkOff();
                //closeDome();
                Dome.Park();
                Telescope.Park();
                Util.AbortScript();
            }
        case 2:
            if (Dome.ShutterStatus == 2) {
                Console.Printline("Dome shutter is opening.")
                Util.WaitForMilliseconds(10000);
                weatherCheck();
                main();
                break;
            }
        case 3:
            if (Dome.ShutterStatus == 3) {
                Util.WaitForMilliseconds(10000);
                trkOff();
                //closeDome();
                Dome.Park();
                Telescope.Park();
                Util.AbortScript();
            }
        case 4:
            if (Dome.ShutterStatus == 4) {
                Console.PrintLine("There was a problem with the shutter control");
            }
    }
    */
    Console.Printline("starting nautical twilight");
    //Console.Printline(Util.SysUTCDate);
    var n = (Util.SysUTCDate)/ (1000 * 60 * 60 * 24) - 366 * 8 - 365 * 22; // days from J2000.0
    //Console.Printline(n);
    var L = (280.461 + 0.9856474 * n) % 360; // mean longitude mod 360
    //Console.Printline(L);
    var g = (357.528 + 0.9856003 * n) % 360; // mean anomaly mod 360
    //Console.Printline(g);
    var lambda = L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180); //ecliptic longitude of the sun
    //Console.Printline(lambda);
    var epsilon = 23.439 - 0.0000004 * n; //obliquity of the ecliptic plane
    //Console.Printline(epsilon);
    var Y = Math.cos(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180);
    //Console.Printline(Y);
    var X = Math.cos(lambda * Math.PI / 180);
    //Console.Printline(X);
    var a = Math.atan(Y / X);
    //Console.Printline(a);
    var RA;
    if (X < 0) {
        RA = (a*180/Math.PI) + 180;
    } else if (Y < 0 && X > 0) {
        RA = (a*180/Math.PI) + 360;
    } else {
        RA = a * 180 / Math.PI;
    }
    
    var Dec = Math.asin(Math.sin(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180))*180/Math.PI;
   
    ctSun = Util.NewCThereAndNow();
    
    ctSun.RightAscension = RA / 15
    ctSun.Declination = Dec
    elevationSun = ctSun.Elevation
    Console.Printline("Sun is at an elevation of " + elevationSun.toFixed(4));
    
    if (elevationSun > -12.0) {
        count = 0;
        trkOff();
        closeDome();
        Dome.Park();
        Telescope.Park();
        Util.WaitFor(timeDuration/(60*24));
        nauticalTwilight();
        //Util.AbortScript();
    } else {   

        if (count >= 1){
            
            main();
        }
        else {
            count++
            
            openDome();
            homeDome();
            Dome.UnparkHome();
            Console.PrintLine("Dome is now unparked and slaved.");
            trkOn();
            Telescope.Unpark();
            main();
        }
    /*  
        openDome();
        homeDome();
        Dome.UnparkHome();
        Console.PrintLine("Dome is now unparked and slaved.");
        trkOn();
        Telescope.Unpark();
        main();
    */
    }
    
}

function nauticalTwilight_start() {
    Console.Printline("starting nautical twilight check 1");
    
    var n = (Util.SysUTCDate)/ (1000 * 60 * 60 * 24) - 366 * 8 - 365 * 22; // days from J2000.0
   
    var L = (280.461 + 0.9856474 * n) % 360; // mean longitude mod 360
    
    var g = (357.528 + 0.9856003 * n) % 360; // mean anomaly mod 360
    
    var lambda = L + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180); //ecliptic longitude of the sun
   
    var epsilon = 23.439 - 0.0000004 * n; //obliquity of the ecliptic plane
      
    var Y = Math.cos(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180);
    
    var X = Math.cos(lambda * Math.PI / 180);
    
    var a = Math.atan(Y / X);
   
    var RA;
    if (X < 0) {
        RA = (a*180/Math.PI) + 180;
    } else if (Y < 0 && X > 0) {
        RA = (a*180/Math.PI) + 360;
    } else {
        RA = a * 180 / Math.PI;
    }
    
    var Dec = Math.asin(Math.sin(epsilon * Math.PI / 180) * Math.sin(lambda * Math.PI / 180))*180/Math.PI;
    
    ctSun = Util.NewCThereAndNow();
    
    ctSun.RightAscension = RA / 15
    ctSun.Declination = Dec
    elevationSun = ctSun.Elevation
    Console.Printline("Sun is at an elevation of " + elevationSun.toFixed(4));
    if (elevationSun > -12.0) {
        Console.Printline("The sun is higher than -12 degrees.")
        trkOff();
        closeDome();
        Dome.Park();
        Telescope.Park();
        Console.Printline("Waiting for " + timeDuration + " minutes to run sun check again.")
        Util.WaitFor(timeDuration/(60*24));
        nauticalTwilight_start();
        //Util.AbortScript();
    } else {
        Console.Printline("Sun below horizon. Going ahead with script.")
    }
}
  


var timeDuration = 30.0; //mins - min time of observing and time interval before checking the code again

var count = 0;
nauticalTwilight_start();    
openDome();
homeDome();
Dome.UnparkHome();
Console.PrintLine("Dome is now unparked and slaved.");
trkOn();
Telescope.Unpark();
Console.Printline(Telescope.AtPark);
Console.PrintLine("Tracking is turned on.");
biasCollection();

//nauticalTwilight();

function main() {
    var writeDir = "29032021"
    Console.Printline("Time check 1: " + Util.SysUTCDate + Util.SysUTCOffset);

    var field1 = [273.735, -18.638]; // June/July
    var field2 = [103.263, 24.329]; // January
    var field3 = [129.869, 19.474]; // February
    var field4 = [56.684, 24.313]; // August
    var field5 = [318.657, -13.830]; // December
    var field6 = [222.785, -11.810]; // May
    var field7 = [334.741, -12.383]; // September
    var field8 = [39.791, 16.953]; // November
    var field9 = [8.974, 1.834]; // October
    var field10 = [142.138, 12.533]; // March
    var field11 = [206.512, -10.259]; // April


    // finding RA and Dec of all the fields above
    ct1 = Util.NewCThereAndNow()
    ct1.RightAscension = field1[0] / 15;
    ct1.Declination = parseFloat(field1[1]);

    ct2 = Util.NewCThereAndNow()
    ct2.RightAscension = field2[0] / 15;
    ct2.Declination = parseFloat(field2[1]);

    ct3 = Util.NewCThereAndNow()
    ct3.RightAscension = field3[0] / 15;
    ct3.Declination = parseFloat(field3[1]);

    ct4 = Util.NewCThereAndNow()
    ct4.RightAscension = field4[0] / 15;
    ct4.Declination = parseFloat(field4[1]);

    ct5 = Util.NewCThereAndNow()
    ct5.RightAscension = field5[0] / 15;
    ct5.Declination = parseFloat(field5[1]);

    ct6 = Util.NewCThereAndNow()
    ct6.RightAscension = field6[0] / 15;
    ct6.Declination = parseFloat(field6[1]);

    ct7 = Util.NewCThereAndNow()
    ct7.RightAscension = field7[0] / 15;
    ct7.Declination = parseFloat(field7[1]);

    ct8 = Util.NewCThereAndNow()
    ct8.RightAscension = field8[0] / 15;
    ct8.Declination = parseFloat(field8[1]);

    ct9 = Util.NewCThereAndNow()
    ct9.RightAscension = field9[0] / 15;
    ct9.Declination = parseFloat(field9[1]);

    ct10 = Util.NewCThereAndNow()
    ct10.RightAscension = field10[0] / 15;
    ct10.Declination = parseFloat(field10[1]);

    ct11 = Util.NewCThereAndNow()
    ct11.RightAscension = field11[0] / 15;
    ct11.Declination = parseFloat(field11[1]);

  
    // array of elevations, fields, and labels for all the fields for recognition purposes
    fieldInfo = [
        [ct1.Elevation, ct1.Azimuth, field1, "field1"],
        [ct2.Elevation, ct2.Azimuth, field2, "field2"],
        [ct3.Elevation, ct3.Azimuth, field3, "field3"],
        [ct4.Elevation, ct4.Azimuth, field4, "field4"],
        [ct5.Elevation, ct5.Azimuth, field5, "field5"],
        [ct6.Elevation, ct6.Azimuth, field6, "field6"],
        [ct7.Elevation, ct7.Azimuth, field7, "field7"],
        [ct8.Elevation, ct8.Azimuth, field8, "field8"],
        [ct9.Elevation, ct9.Azimuth, field9, "field9"],
        [ct10.Elevation, ct10.Azimuth, field10, "field10"],
        [ct11.Elevation, ct11.Azimuth, field11, "field11"]
    ];
    Console.Printline(fieldInfo);
    
    var elevationLimit = 10.0;
    var azimuthLimit = 180.0;
    var i;
    var k = 0;
    var m;
    // finding moon elevation and azimuth
    Util.Console.PrintLine("== Moon Coordinates ==");
    var SH = new ActiveXObject("WScript.Shell");
    var BS = SH.Exec(ACPApp.Path + "\\aa.exe -moon");
    var coords = "";
    while(BS.Status != 1)
    {
        while(!BS.StdOut.AtEndOfStream)
        {
            coords += BS.StdOut.Read(1);
        }
        Util.WaitForMilliseconds(100);
    }
    coords = coords.trim();

    Util.Console.PrintLine("== " + coords + " ==");

    var bits = coords.split(" ");

    var SUP = Util.Script.SUP;
    Util.Console.PrintLine(bits[1]);
    Util.Console.PrintLine(bits[0]);

    ct = Util.NewCThereAndNow();

    ct.RightAscension = bits[0];
    ct.Declination = bits[1];

    Util.Console.PrintLine(ct.Elevation);
    Util.Console.PrintLine(ct.Azimuth);
    // make a list of angular distance offset of all fields from the moon. these values are in degrees.
    var moon_offset = 10.0 
    var ang_moon = [];
    var ang_dist_moon = [];
    
    for (m = 0; m < fieldInfo.length; m++) {
        ang_moon.push([Math.cos(Math.PI/2 - bits[1]*Math.PI/180) * Math.cos(Math.PI/2 - fieldInfo[m][2][1] * Math.PI / 180) + Math.sin(Math.PI/2 - bits[1]*Math.PI/180) * Math.sin(Math.PI/2 - fieldInfo[m][2][1] * Math.PI / 180) * Math.cos((bits[0]*15 - fieldInfo[m][2][0]) * Math.PI / 180)]);
        
        ang_dist_moon.push([Math.acos(ang_moon[m])*180/Math.PI]);
     
    }
    Console.Printline("Angular distance for each field " + ang_dist_moon);
    
    // find all fields that are above the elevation limit of 10 at that time in the night and all fields more than 10 degrees away from the Moon

    Console.Printline("Removing fields below the horizon and not going to rise up in the night");
    for (i = 0; i < fieldInfo.length; i++) {
        if ((fieldInfo[i - k][0] < elevationLimit) && (fieldInfo[i - k][1] > azimuthLimit)) {
            
            Console.Printline(fieldInfo[i - k][0] < elevationLimit && fieldInfo[i - k][1] > azimuthLimit);
            fieldInfo.splice(i - k, 1);
            ang_dist_moon.splice(i - k, 1);
            k = k + 1;      
            
            
        } 
    }
    Console.Printline("Fields above horizon and rising selected. Time check 2 " + Util.SysUTCDate + Util.SysUTCOffset);
    //Console.Printline("The highest ranked field above the elevation limit of " + (elevationLimit.toString()) + " is " + elevations[0][3]);
  
    Console.Printline(fieldInfo);
    Console.Printline(ang_dist_moon);
    //make sure that only fields above elevation and more than 10 degrees 
    
    var r;
    var a = 0;
    
    for (r = 0; r < ang_dist_moon.length; r++) {
        
        if (ang_dist_moon[r][0] < moon_offset) {
            fieldInfo.splice(r - a, 1);
            a = a + 1;
            //Console.Printline("After splicing: " + fieldInfo[r-a][3]);
          
        } 
    }
    
    
    

    // check the remaining fields to make sure they have a min of timeDuration hours of viewing time
    // this part of the code also changes the field to a higher ranked field if it becomes visible in the night
    Console.Printline("Choosing the highest ranked field that will be visible for " + timeDuration + " minutes");
    var n = 0; 
    do {
        var field = fieldInfo[n];
        ct = Util.NewCTHereAndNow();
        ct.RightAscension = field[2][0] / 15;
        ct.Declination = parseFloat(field[2][1]);
        Console.Printline(field[3]);
        var lat = ct.Latitude;
       
        var ST = ct.SiderealTime;   
        
        var HA = ST - ct.RightAscension;
        
        var Alt = Math.asin(Math.sin(ct.Declination*Math.PI/180) * Math.sin(lat*Math.PI/180) + Math.cos(ct.Declination*Math.PI/180) * Math.cos(lat*Math.PI/180) * Math.cos(HA*15*Math.PI/180))*180/Math.PI;
        n += 1;
        
        var HA_limit = Math.acos((Math.sin(elevationLimit*Math.PI/180) - Math.sin(ct.Declination*Math.PI/180)*Math.sin(lat*Math.PI/180))/(Math.cos(ct.Declination*Math.PI/180)*Math.cos(lat*Math.PI/180)))*(180/Math.PI)/15;
        
    } while (Alt < elevationLimit || Math.abs(HA_limit - HA) < timeDuration/60.0); // RA values - 15 degrees = 60 mins, 0.25 degrees = 1 min
    Console.Printline("The field chosen is " + field[3] + " with an elevation of " + ct.Elevation.toFixed(4) + " degrees");
    Console.Printline("Time check: "+ Util.SysUTCDate + Util.SysUTCOffset);

    Console.PrintLine("Target is at an elevation of " + ct.Elevation.toFixed(4) + " degrees.");
    Console.PrintLine("Going to " + field[3] + ". RA = " + ct.RightAscension.toFixed(4) + " Dec = " + ct.Declination + " Elevation = " + ct.Elevation.toFixed(4));
    
    gotoRADec(ct.RightAscension, ct.Declination);
    Console.PrintLine("At target.");
    //ct = Util.NewCThereAndNow()
    


    Console.PrintLine("Target Alt/Az is: Alt. =" + ct.Elevation.toFixed(2) + "   Az.= " + ct.Azimuth.toFixed(2));

    if (Telescope.SideOfPier != Telescope.DestinationSideOfPier(ct.RightAscension, ct.Declination)) {
        Console.PrintLine("Flipping sides of pier...")
        gotoRADec(ct.RightAscension, ct.Declination);

    }
    else { Console.PrintLine("Already on the right side of the pier"); }
/*
    while(Math.abs(Dome.Azimuth - ct.Azimuth) > 20.0) {
        Util.WaitForMilliseconds(2000);
        Console.Printline("Waiting for dome slit to reach telescope position.");
    }
*/  
    Console.Printline("Time check 3: " + Util.SysUTCDate + Util.SysUTCOffset);
    Console.Printline("Starting frame collection")
    var loop_start = Util.SysUTCDate;
    while (Util.SysUTCDate - loop_start < timeDuration*60*1000) {
        
        Util.WaitForMilliseconds(500);
       

        

        var i, numruns, numexps;

        numexps = 2400;
        Console.Printline(field[1][0])
        

        // tid = Util.ShellExec("C:\\Users\\RedBird\\VS-Projects\\ColibriGrab\\Debug\\ColibriGrab.exe", "-n " + numexps.toString() + " -p " + "RA" + ct.RightAscension.toString() + "-DEC" + ct.Declination.toString() + "_25ms -e 25 -t 0 -f normal -w D:\\" + writeDir);
        Console.Printline(field[3])

        
        tid = Util.ShellExec("ColibriGrab.exe", "-n " + numexps.toString() + " -p " + field[3] + "_25ms -e 25 -t 5 -f normal -w D:\\ColibriData\\29032021");


        while (Util.IsTaskActive(tid)) {
            Util.WaitForMilliseconds(1000);
            //Console.PrintLine("We are stuck in the looop :(");
            Console.PrintLine("Done exposing run # " + i.toString());
            //Console.PrintLine("--------------")
        }
    
        //Util.ShellExec("taskkill.exe", "/im ColibriGrab.exe /t /f");
        //console.PrintLine(field)
        //frameCollection();
        Util.WaitForMilliseconds(1000);
        Console.Printline("Time check 4: " + Util.SysUTCDate + Util.SysUTCOffset);
    }
    Console.Printline("Frame collection ended.")
    
    //Console.Printline("Main round done.");
    //Console.Printline(Util.SysUTCDate - loop_start);
    //Console.Printline(Util.SysUTCDate - loop_start < timeDuration*60*1000 - 0.5*60*1000); 
    Console.Printline("Time check 5: " + Util.SysUTCDate + Util.SysUTCOffset);
    
    nauticalTwilight();

}