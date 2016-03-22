/*===============================================================================
************   $ extend   ************
===============================================================================*/
;
(function($) {
    $.animationFrame = function(cb) {
        var args, isQueued, context;
        return function() {
            args = arguments;
            context = this;
            if (!isQueued) {
                isQueued = true;
                requestAnimationFrame(function() {
                    cb.apply(context, args);
                    isQueued = false;
                });
            }
        };
    };

    $.trimLeft = function(str) {
        return str == null ? "" : String.prototype.trimLeft.call(str)
    };
    $.trimRight = function(str) {
        return str == null ? "" : String.prototype.trimRight.call(str)
    };
    $.trimAll = function(str) {
        return str == null ? "" : str.replace(/\s*/g, '');
    };
    $.cellPhone = function(v) {
        var cellphone = /^1[3|4|5|8][0-9]\d{8}$/;
        return cellphone.test(v);
    };
    $.email = function(v) {
        var email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
        return email.test(v);
    };
    //全数字
    $.isDigit = function(v) {
        var patrn = /^[0-9]{1,20}$/;
        return patrn.test(v);
    };

    //校验登录名：只能输入5-20个以字母开头、可带数字、“_”、“.”的字串 
    $.isRegisterUserName = function(v) {
        var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
        return patrn.test(v);
    };

    //校验密码：只能输入6-20个字母、数字、下划线   
    $.registerPasswd = function(v) {
        var patrn = /^(\w){6,20}$/;
        return patrn.test(v);
    };
    // 至少一个小写字母
    $.charOne = function(v) {
        var patrn = /[a-z]/;
        return patrn.test(v);
    };
    // 至少一个大写字母
    $.upperCharOne = function(v) {
        var patrn = /[A-Z]/;
        return patrn.test(v);
    };

    $.idcard = function(num) {
        num = num.toUpperCase();
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            //            alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。 ');
            return false;
        }
        // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        // 下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re); // 检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                //                alert('输入的身份证号里出生日期不对！');
                return false;
            } else { // 将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD
                // 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return true;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re); // 检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                //                alert('输入的身份证号里出生日期不对！');
                return false;
            } else { // 检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD
                // 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0,
                    i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    //                    alert('18位身份证的校验码不正确！应该为：' + valnum);
                    return false;
                }
                return true;
            }
        }

        return false;
    };
    //获取字符串的字节长度
    $.getBytesLength = function(str) {
        if (!str) {
            return 0;
        }
        var totalLength = 0;
        var charCode;
        var len = str.length
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode < 0x007f) {
                totalLength++;
            } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
                totalLength += 2;
            } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
                totalLength += 3;
            } else {
                totalLength += 4;
            }
        }
        return totalLength;
    };

    $.chk = function(obj) {
        return !!((obj && obj !== 'null' && obj !== 'undefined') || obj === 0);
    };

}($));
/*===============================================================================
************   $ extend end  ************
************   $ dateFormat begin  ************
===============================================================================*/

(function($) {
    /**
     * dataFormat工具类接口
     */
    // 下面是日期的format的格式转换的规则
    /*
    Full Form和Short Form之间可以实现笛卡尔积式的搭配

     Field        | Full Form          | Short Form                            中文日期，所有Full Form 不处理(除了年)
     -------------+--------------------+-----------------------
     Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)      NNNN  NN  N
     Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)      Y
                  | NNN (abbr.)        |
     Day of Month | dd (2 digits)      | d (1 or 2 digits)                     R
     Day of Week  | EE (name)          | E (abbr)
     Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)                     S
     Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)                     T
     Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)                     U
     Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)                     V
     Minute       | mm (2 digits)      | m (1 or 2 digits)                     F
     Second       | ss (2 digits)      | s (1 or 2 digits)                     W
     AM/PM        | a                  |

     */
    //
    //例子
    //dataFormat.formatDateToString(new Date(),"yyyymmdd");//
    //dataFormat.formatStringToDate("1992_09_22","yyyy_mm_dd");
    //dataFormat.formatStringToString("1992_09_22","yyyy_mm_dd","yy______mmdd");
    //dataFormat.compareDates("1992_09_22","yyyy_mm_dd","1992_09_23","yyyy_mm_dd");//返回false
    //dataFormat.isDate("1992_09_________22","yyyy_mm_________dd");//返回true
    //
    var dataFormat = {
        MONTH_NAMES: new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ),
        DAY_NAMES: new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ),
        //    chi : [ '一', '二', '三', '四', '五', '六', '七', '八', '九','十'],
        toChi: function(year) { //转换中文，不进位   //todo 需要优化为一条正则表达式
            return year.replace(/0/g, '零').replace(/1/g, '一').
            replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四')
                .replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七')
                .replace(/8/g, '八').replace(/9/g, '九');
        },

        toChiNum: function(n) { //转换中文，进位,只支持到十位数
            var num = n / 1;
            var num_s = num + '';
            if (num > 9 && num < 20) {
                num_s = '十' + num_s.charAt(1);
            } else if (num > 19) {
                num_s = num_s.charAt(0) + '十' + num_s.charAt(1);
            }
            num_s = this.toChi(num_s);
            if (num != 0) num_s = num_s.replace(/零/g, '');
            return num_s;
        },
        toNum: function(year) { //中文转换阿拉伯数字，纯替换  //todo 需要优化为一条正则表达式
            return year.replace(/零/g, '0').replace(/一/g, '1').
            replace(/二/g, '2').replace(/三/g, '3').replace(/四/g, '4')
                .replace(/五/g, '5').replace(/六/g, '6').replace(/七/g, '7')
                .replace(/八/g, '8').replace(/九/g, '9');
        },
        toNum2: function(year) { //中文转换阿拉伯数字，带进位，支持2位数 //todo 需要优化为一条正则表达式
            var l = year.length;
            if (year == '十') return 10;
            if (l == 1 && '十' != year) return this.toNum(year); //零 到 九
            if (l == 2 && '十' != year.charAt(l - 1)) return this.toNum(year.replace(/十/g, '一')); //十一 到 十九
            if (l == 2 && '十' == year.charAt(l - 1)) return this.toNum(year.replace(/十/g, '零')); //二十 到 九十 的整数
            if (l == 3) return this.toNum(year.replace(/十/g, '')); //二十一 到 九十九 的三位中文数字
        },

        LZ: function(x) {
            return (x < 0 || x > 9 ? "" : "0") + x;
        },
        isDate: function(val, format) { //看看给定的字符串是否为Date类型
            var date = this.formatStringToDate(val, format);
            if (date == 0) {
                return false;
            }
            return true;
        },
        compareDates: function(date1, dateformat1, date2, dateformat2) { //比较大小
            var d1 = this.formatStringToDate(date1, dateformat1);
            var d2 = this.formatStringToDate(date2, dateformat2);
            if (d1 == 0 || d2 == 0) {
                alert("format格式转换有问题");
                return;
            } else if (d1 > d2) {
                return true;
            }
            return false;
        },
        formatDateToString: function(date, format) { //将日期转化为Str
            //赋值
            format = format + "";
            var result = ""; //返回的结果字符串
            var i_format = 0; //format字符串的位置指针
            var c = "";
            var token = ""; //format字符串中的子串
            var y = date.getFullYear() + "";
            var M = date.getMonth() + 1;
            var d = date.getDate();
            var E = date.getDay();
            var H = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;

            //将所有的规则的key加入到value对象的key中,将传入的date取出来的值加入到value对象的value中
            var value = new Object();
            value["y"] = "" + y;
            value["yyyy"] = y;
            value["yy"] = y.substring(2, 4);

            value["M"] = M;
            value["MM"] = this.LZ(M);
            value["MMM"] = this.MONTH_NAMES[M - 1];
            value["NNN"] = this.MONTH_NAMES[M + 11];

            value["d"] = d;
            value["dd"] = this.LZ(d);
            value["E"] = this.DAY_NAMES[E + 7];
            value["EE"] = this.DAY_NAMES[E];

            value["H"] = H;
            value["HH"] = this.LZ(H);
            if (H == 0) {
                value["h"] = 12;
            } else if (H > 12) {
                value["h"] = H - 12;
            } else {
                value["h"] = H;
            }
            value["hh"] = this.LZ(value["h"]);
            if (H > 11) {
                value["K"] = H - 12;
            } else {
                value["K"] = H;
            }
            value["k"] = H + 1;
            value["KK"] = this.LZ(value["K"]);
            value["kk"] = this.LZ(value["k"]);

            if (H > 11) {
                value["a"] = "PM";
            } else {
                value["a"] = "AM";
            }

            value["m"] = m;
            value["mm"] = this.LZ(m);

            value["s"] = s;
            value["ss"] = this.LZ(s);

            value["NNNN"] = this.toChi(value["yyyy"]);
            value["NN"] = this.toChi(value["yy"]);
            value["N"] = this.toChi(value["y"]);
            value["Y"] = this.toChiNum(M);
            value["R"] = this.toChiNum(d);
            value["S"] = this.toChiNum(value["h"]);
            value["T"] = this.toChiNum(value["H"]);
            value["U"] = this.toChiNum(value["K"]);
            value["V"] = this.toChiNum(value["k"]);
            value["F"] = this.toChiNum(m);
            value["W"] = this.toChiNum(s);


            //开始进行校验
            while (i_format < format.length) { //以i_format为记录解析format的指针,进行遍历
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) { //当进行遍历的字符相同的时候,token取的就是当前遍历的相同字符,例如yyyy mm dd,这里就是三个循环yyyy mm dd
                    token += format.charAt(i_format++);
                }
                if (value[token] != null) {
                    result = result + value[token]; //循环叠加value
                } else {
                    result = result + token;
                }
            }
            return result; //最后返回格式化的字符串
        },
        _isInteger: function(val) {
            //return ['0','1','2','3','4','5','6','7','8','9'].contains(val);
            var digits = "1234567890";
            for (var i = 0; i < val.length; i++) {
                if (digits.indexOf(val.charAt(i)) == -1) {
                    return false;
                }
            }
            return true;
        },
        _isInteger_chi: function(val) {
            //return ['0','1','2','3','4','5','6','7','8','9'].contains(val);
            var digits = "零一二三四五六七八九十";
            for (var i = 0; i < val.length; i++) {
                if (digits.indexOf(val.charAt(i)) == -1) {
                    return false;
                }
            }
            return true;
        },
        _getInt: function(str, i, minlength, maxlength) {
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (this._isInteger(token)) {
                    return token;
                }
            }
            return null;
        },
        _getInt2: function(str, i, minlength, maxlength) {
            for (var x = maxlength; x >= minlength; x--) {
                var token = str.substring(i, i + x);
                if (token.length < minlength) {
                    return null;
                }
                if (token) {
                    return token;
                }
            }
            return null;
        },

        _getInt_month: function(str, i) {
            for (var x = 2; x >= 1; x--) {
                var token = str.substring(i, i + x);
                if (token.length < 1) {
                    return null;
                }
                if (token.length == 1) {
                    return token;
                }
                if (['十一', '十二'].contains(token)) {
                    return token;
                }
            }
            return null;
        },

        _getInt_date: function(str, i) {
            for (var x = 3; x >= 1; x--) {
                var token = str.substring(i, i + x);
                if (token.length < 1) {
                    return null;
                }
                if (token.length == 1) return token;
                if (this._isInteger_chi(token)) return token;
            }
            return null;
        },
        formatStringToDate: function(val, format) { //将字符串转化为Date
            //赋值
            val = val + "";
            format = format + "";
            var i_val = 0; //val字符串的指针
            var i_format = 0; //format字符串的指针
            var c = "";
            var token = "";
            var token2 = "";
            var x, y;
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = 1;
            var hh = now.getHours();
            var mm = now.getMinutes();
            var ss = now.getSeconds();
            var ampm = "";

            while (i_format < format.length) {
                //根据类似yyyy,mm同名的字符串的规则,可以取得yyyy或者mm等format字符串
                c = format.charAt(i_format);
                token = "";
                while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                //从val中通过format中的token解析,进行规则转换
                if (token == "NNNN" || token == "NN" || token == "N") { //年 中文
                    if (token == "NNNN") {
                        x = 4;
                        y = 4;
                    }
                    if (token == "NN") {
                        x = 2;
                        y = 2;
                    }
                    if (token == "N") {
                        x = 2;
                        y = 4;
                    }
                    year = this._getInt2(val, i_val, x, y); //从val字符串中根据val的指针i_val,定义的最小/大长度(如上面的y,它所允许的最大长度就是4,最小长度就是2,例如2009,09等)
                    if (year == null) {
                        return 0;
                    }
                    year = this.toNum(year);
                    i_val += year.length; //修改val的指针i_val,使其指向当前的变量
                    if (year.length == 2) { //年输入两位数的作用
                        if (year > 70) {
                            year = 1900 + (year - 0); //如果>70年的话,肯定不是现在了,加1900就行了
                        } else {
                            year = 2000 + (year - 0);
                        }
                    }
                } else if (token == "Y") { //月_数字_大写

                    month = this._getInt_month(val, i_val);
                    i_val += month.length;
                    month = this.toNum2(month);
                    if (month == null || (month < 1) || (month > 12)) {
                        return 0;
                    }

                } else if (token == "R") { //日 数字 中文

                    date = this._getInt_date(val, i_val);
                    i_val += date.length;
                    date = this.toNum2(date);
                    if (date == null || (date < 1) || (date > 31)) {
                        return 0;
                    }

                } else if (token == "S") { //小时 数字 中文 h
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    if (hh == null || (hh < 1) || (hh > 12)) {
                        return 0;
                    }
                } else if (token == "T") { //小时 数字 中文  H
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    if (hh == null || (hh < 0) || (hh > 23)) {
                        return 0;
                    }
                } else if (token == "U") { //小时 数字 中文 K
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    if (hh == null || (hh < 0) || (hh > 11)) {
                        return 0;
                    }
                } else if (token == "V") { //小时 数字 中文 k
                    hh = this._getInt_date(val, i_val);
                    i_val += hh.length;
                    hh = this.toNum2(hh);
                    hh--;
                    if (hh == null || (hh < 1) || (hh > 24)) {
                        return 0;
                    }
                } else if (token == "F") { //分 数字 中文
                    mm = this._getInt_date(val, i_val);
                    i_val += mm.length;
                    mm = this.toNum2(mm);
                    if (mm == null || (mm < 0) || (mm > 59)) {
                        return 0;
                    }
                } else if (token == "W") { //秒 数字 中文
                    ss = this._getInt_date(val, i_val);
                    i_val += ss.length;
                    ss = this.toNum2(ss);
                    if (ss == null || (ss < 0) || (ss > 59)) {
                        return 0;
                    }
                } else if (token == "yyyy" || token == "yy" || token == "y") { //年
                    if (token == "yyyy") {
                        x = 4;
                        y = 4;
                    }
                    if (token == "yy") {
                        x = 2;
                        y = 2;
                    }
                    if (token == "y") {
                        x = 2;
                        y = 4;
                    }
                    year = this._getInt(val, i_val, x, y); //从val字符串中根据val的指针i_val,定义的最小/大长度(如上面的y,它所允许的最大长度就是4,最小长度就是2,例如2009,09等)
                    if (year == null) {
                        return 0;
                    }
                    i_val += year.length; //修改val的指针i_val,使其指向当前的变量
                    if (year.length == 2) { //年输入两位数的作用
                        if (year > 70) {
                            year = 1900 + (year - 0); //如果>70年的话,肯定不是现在了,加1900就行了
                        } else {
                            year = 2000 + (year - 0);
                        }
                    }
                } else if (token == "MMM" || token == "NNN") { //月_name
                    month = 0;
                    for (var i = 0; i < this.MONTH_NAMES.length; i++) {
                        var month_name = this.MONTH_NAMES[i];
                        if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) { //如果指针指向的长度与this.MONTH_NAMES中的任何一项都相同
                            if (token == "MMM" || (token == "NNN" && i > 11)) {
                                month = i + 1; //将month转换为数字,+1是js中的month比实际的小1
                                if (month > 12) {
                                    month -= 12;
                                }
                                i_val += month_name.length;
                                break;
                            }
                        }
                    }
                    if ((month < 1) || (month > 12)) {
                        return 0;
                    } //不符合规则返回0
                } else if (token == "EE" || token == "E") { //日
                    for (var i = 0; i < this.DAY_NAMES.length; i++) {
                        var day_name = this.DAY_NAMES[i];
                        if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                            i_val += day_name.length;
                            break;
                        }
                    }
                } else if (token == "MM" || token == "M") { //月_数字
                    month = this._getInt(val, i_val, token.length, 2);
                    if (month == null || (month < 1) || (month > 12)) {
                        return 0;
                    }
                    i_val += month.length;
                } else if (token == "dd" || token == "d") {
                    date = this._getInt(val, i_val, token.length, 2);
                    if (date == null || (date < 1) || (date > 31)) {
                        return 0;
                    }
                    i_val += date.length;
                } else if (token == "hh" || token == "h") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 12)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "HH" || token == "H") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 23)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "KK" || token == "K") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 11)) {
                        return 0;
                    }
                    i_val += hh.length;
                } else if (token == "kk" || token == "k") {
                    hh = this._getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 24)) {
                        return 0;
                    }
                    i_val += hh.length;
                    hh--;
                } else if (token == "mm" || token == "m") {
                    mm = this._getInt(val, i_val, token.length, 2);
                    if (mm == null || (mm < 0) || (mm > 59)) {
                        return 0;
                    }
                    i_val += mm.length;
                } else if (token == "ss" || token == "s") {
                    ss = this._getInt(val, i_val, token.length, 2);
                    if (ss == null || (ss < 0) || (ss > 59)) {
                        return 0;
                    }
                    i_val += ss.length;
                } else if (token == "a") { //上午下午
                    if (val.substring(i_val, i_val + 2).toLowerCase() == "am") {
                        ampm = "AM";
                    } else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") {
                        ampm = "PM";
                    } else {
                        return 0;
                    }
                    i_val += 2;
                } else { //最后,没有提供关键字的,将指针继续往下移
                    if (val.substring(i_val, i_val + token.length) != token) {
                        return 0;
                    } else {
                        i_val += token.length;
                    }
                }
            }
            //如果有其他的尾随字符导致字符串解析不下去了,那么返回0
            /*if (i_val != val.length) { return 0; }*/ //todo此处有问题
            //对于特殊月份:2月,偶数月的天数进行校验
            if (month == 2) {
                if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { //测试是否是闰年
                    if (date > 29) {
                        return 0;
                    }
                } else {
                    if (date > 28) {
                        return 0;
                    }
                }
            }
            if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                if (date > 30) {
                    return 0;
                }
            }
            //对于上午下午的具体显示小时数,进行加减
            if (hh < 12 && ampm == "PM") {
                hh = hh - 0 + 12;
            } else if (hh > 11 && ampm == "AM") {
                hh -= 12;
            }

            //将给定的字符串解析成Data
            var newdate = new Date(year, month - 1, date, hh, mm, ss);
            return newdate;
        },
        formatStringToString: function(val, format1, format2) { //将一个字符串从原来的format1的字符串格式输出到format2字符格式
            var tempDate = this.formatStringToDate(val, format1);
            if (tempDate == 0) {
                return val;
            }
            var returnVal = this.formatDateToString(tempDate, format2);
            if (returnVal == 0) {
                return val;
            }
            return returnVal;
        }

    };

    $.formatStringToDate = function(val) { //将字符串转化为Date
        // return dataFormat.formatStringToDate(val, format);
        function getDate(strDate) {
            var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                function(a) {
                    return parseInt(a, 10) - 1;
                }).match(/\d+/g) + ')');
            return date;
        }
        return getDate(val);
    };
    $.formatDateToString = function(date, format) { //将日期转化为Str
        !format && (format = 'yyyy-MM-dd HH:mm:ss');
        return dataFormat.formatDateToString(date, format);
    };

    $.getDays = function(format) { //获取当前时间
        return $.formatDateToString(new Date(), format);
    };

    $.milliseconds = function(str) {
        return $.formatStringToDate(str).getTime();
    };

    $.msToDateStr = function(ms, format) {
        return $.formatDateToString(new Date(ms), format);
    }

    $.daysBetween = function(startDate, endDate) {
        var res = $.getMilliseconds(startDate) - $.getMilliseconds(endDate);
        return Math.abs(res / 86400000);
    };

    $.showToast = function(opts) {
        $.chk(toast) && toast.remove();
        window.clearTimeout(clearT);
        opts = $.extend(true, {
            time: 2000,
            message: ''
        }, opts);
        if (opts.message) {
            toast = $('<div class="ui-toast"><span class="ui-toast-message">' + opts.message + '</span></div>').appendTo($('body'));
            var tWidth = toast.width();
            toast.css({
                'margin-left': -tWidth / 2
            });
        } else {
            toast = $('<div class="ui-toast"><span class="ui-toast-white ui-spinner"></span></div>').appendTo($('body'));
        }
        clearT = setTimeout(function() {
            toast.remove();
        }, opts.time);
        return toast;
    };

}($));

/*/*===============================================================================
************   $ dateFormat end  ************
===============================================================================*/