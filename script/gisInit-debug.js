/**
 * Created by dreamice on 2021/5/118.
 */
var gis_version = 1.0;
var jsts_version = "2.6.1";
var turf_version = "6.3.0";
$LAB.script("script/plugins/JSTS/2.6.1/jsts.js?version="+jsts_version)
.script("script/plugins/Turf/6.3.0/turf.min.js?version="+turf_version).wait()
.script("script/modules/topology.js?version="+gis_version)
.script("script/modules/common.js?version="+gis_version)
.script("script/modules/style.js?version="+gis_version)
.script("script/modules/locate.js?version="+gis_version)
.script("script/modules/coorformat.js?version="+gis_version)
.script("script/modules/control.js?version="+gis_version).wait()
.script("script/modules/main.js?version="+gis_version);