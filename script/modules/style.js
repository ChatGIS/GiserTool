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
	},
	
	stylePolygonGreen : new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: "green",
			width: 1
		})
		
	}),
	
	stylePolygonRed : new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: "red",
			width: 1
		})
		
	}),
	
	// 面积、长度测量样式
	styleMeasure : new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 255, 0.2)'
		}),
		stroke: new ol.style.Stroke({
			color: 'rgba(0, 0, 0, 0.5)',
			lineDash: [10, 10],
			width: 2
		}),
		image: new ol.style.Circle({
			radius: 5,
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 0, 0.7)'
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			})
		})
	}),
	
	// 定位样式:百度
	styleLocateBD : new ol.style.Style({
		image: new ol.style.Icon({
			src:'resource/image/locate1.png',
			size:[64,64],
			offset:[-16, -5]
		}),
		text: new ol.style.Text({
			text:"BD-09",
			font:"15px bold Serif",
			offsetX:-3,
			offsetY:-10
		})
	}),
	
	// 定位样式:GCj
	styleLocateGCj : new ol.style.Style({
		image: new ol.style.Icon({
			src:'resource/image/locate1.png',
			size:[64,64],
			offset:[-16, -5]
		}),
		text: new ol.style.Text({
			text:"GCj-02",
			font:"15px sans-serif",
			offsetX:-3,
			offsetY:-10
		})
	})
}
