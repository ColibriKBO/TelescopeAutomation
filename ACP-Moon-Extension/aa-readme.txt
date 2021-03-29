This is Stephan Moshier's 'aa' planetary ephemeris program, modified by Bob Denny <rdenny@dc3.com>. It is intended to be used by ACP to get the current topocentric coordinates of the Moon for use within an ACP observing plan. In its normal mode, invoking as aa.exe, it will ask questions and produce ephemerides for the major planets, the moon, and the sun. However if invoked with a command line of 'aa -moon' it will simply write the topocentric coordinates of the moon in decimal format (hours, degrees) at the current instant to its standard out. 

The program requires a config file called aa.ini that resides in (preferably) Common\Public Documents, or in the same directory as aa.exe. It must look like this:

--- snip ---
-71.13     ; Terrestrial longitude of observer, degrees negative west
42.27      ; Geodetic latitude, degrees

0.0        ; Height above sea level, meters

12.0       ; Atmospheric temperature, deg C

1010.0     ; Atmospheric pressure, millibars

1          ; 0 - TDT=UT, 1 - input=TDT, 2 - input=UT

0.0        ;Use this deltaT (sec) if nonzero, else compute it.

------------

The sources for this program are available on request from Robert B. Denny, DC-3 Dreams, SP at no charge (as is the program itself). Contact me at rdenny@dc3.com. 

Bob Denny  09-May-2014
