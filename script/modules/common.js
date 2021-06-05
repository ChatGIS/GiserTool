
var cm = {
	/**
	 * 将度转换成为度分秒(返回字符串格式)
	 * @param value 经纬度数值
	 * @param type 0：经度，1：纬度
	 * @param format 格式：ddd.dddddd°、ddd°mm.mmm′、ddd°mm′ss.ss″
	 * @returns {string}
	 */
	formatDegree : function(value, type, format) {
	    var output = '';
	    var prefixs = type == 0 ? ['西', '东'] : ['南', '北'];
	    var prefix = value < 0 ? prefixs[0] : prefixs[1];
	    value = Math.abs(value);
	    var v1 = Math.floor(value); //度
	    var v2 = Math.floor((value - v1) * 60); //分
	    var v3 = ((value - v1) * 3600 % 60).toFixed(2); //秒
	    switch (format) {
	        case 0:
	            output = prefix + value.toFixed(6) + '°';
	            break;
	        case 1:
	            output = prefix + v1 + '°' + ((value - v1) * 60).toFixed(3) + '′';
	            break;
	        case 2:
	            output = prefix + v1 + '°' + v2 + '′' + v3 + '″';
	            break;
	    }
	    return output;
	},
};
