/* 
	定位相关文件
	created by Dreamice on 2021/05/20
 */
var locate = {
	/* 
	获取当前位置
	Microsoft Edge可使用；
	Chrome报错：Network location provider at 'https://www.googleapis.com/' : No response received.
	 */
	getCurrentPosition: function(){
		var lonlat = "";
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				function showPosition(position) {
					console.log("Longitude: " + position.coords.longitude + ";" + "Latitude: " + position.coords.latitude);
					lonlat = position.coords.longitude + "," + position.coords.latitude;
					return lonlat;
				},
				function error(me){
					console.log(me.message)
				}
			);
		} else{
			alert("该浏览器不支持Geolocation");
		}
	},
	
}