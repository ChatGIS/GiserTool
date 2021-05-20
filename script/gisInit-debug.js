/**
 * Created by dreamice on 2021/5/118.
 */
var gis_version = 1.0;
$LAB.script("script/modules/common.js?version="+gis_version)
.script("script/modules/style.js?version="+gis_version)
.script("script/modules/locate.js?version="+gis_version).wait()
.script("script/modules/main.js?version="+gis_version);