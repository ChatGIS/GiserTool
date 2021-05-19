/* 
	样式文件
	created by Dreamice on 2021/05/19 
 */
var style = {
	// 点样式-红色
	stylePointRed : new ol.style.Style({
		image: new ol.style.Circle({
			radius: 10,
			stroke: new ol.style.Stroke({
				color: 'yellow',
				width: 1
			}),
			fill: new ol.style.Fill({
				color: 'red'
			})
		})
	}),
	
	// 点样式-绿色		
	stylePointGre : new ol.style.Style({
		image: new ol.style.Circle({
			radius: 10,
			stroke: new ol.style.Stroke({
				color: 'yellow',
				width: 1
			}),
			fill: new ol.style.Fill({
				color: 'green'
			})
		})
	}),

	/* 
		闪烁点 
	*/
	flag : 1,
	flashPointStyle : function(feature){
		setInterval(function flashStyle(){
			if(this.flag == 1){
				feature.setStyle(style.stylePointRed);
				this.flag = 2;
			} else {
			 	feature.setStyle(style.stylePointGre);
			 	this.flag = 1;
			 }
		},400);
	}
}