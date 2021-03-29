String.prototype.trim = function()
{
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

var curTarget = null;

function main()
{
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
}