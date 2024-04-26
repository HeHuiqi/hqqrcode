/**
 * 页面提示工具类Toast
 * 可在页面中显示一个可自动关闭的弹出层，用作提示作用
 * 具体可以传入的值，请查看类中的properties结构体
 * 用法：
    new EpgToast().show({
        content: "我是最简单用法"      //其他属性将使用默认值
    });
    new EpgToast().show({
        xPosition: "left",          //x轴位置
        yPosition: "center",
        isHTML: "yes",          //此属性可以打开插入HTML的接口
        content: "<i>我可以插入HTML</i>"
    });
    var toast = new EpgToast().show({
        duration: 0,                    //设置为0后，将不会主动关闭，需要调用close方法
        content: "我将不会主动关闭"
    });
    //toast.close();
 */
var EpgToast = (function () {
    //横轴位置可选值
    var _XY_POSITION = {
        LEFT: "left",
        RIGHT: "right",
        CENTER: "center",
        TOP: "top",
        BOTTOM: "bottom"
    };
    //边框圆角类型可选值
    var _BORDER_RADIUS = {
        AUTO: "auto",           //根据toast高度改变边框圆角
        DISABLED: "disabled"    //关闭边框圆角
    };
    //横轴纵轴边距量px，不带单位
    var _XY = {
        x: 50, //横轴 左右距边框 50px
        y: 20  //纵轴 上下距边框 20px
    };
    //内容位置
    var _CONTENT_ALIGN = {
        LEFT: "left",
        CENTER: "center",
        RIGHT: "right"
    };
    //可以通过show方法改变默认值
    var _TDefault = {
        xyPosition: {
            x: _XY_POSITION.CENTER,
            y: _XY_POSITION.BOTTOM
        },
        xyOffset: {
            x: 0,
            y: 0
        },
        wh: {
            width: "auto",
            height: "auto"
        },
        padding: "10px 30px",
        fontSize: "24px",
        color: "white",
        bgColor: "rgba(150, 150, 150, 1)",
        borderRadius: _BORDER_RADIUS.AUTO,
        isHTML: false,
        duration: 3000,
        contentAlign: _CONTENT_ALIGN.CENTER,
        fade: {
            inTime: 1000,   //显示淡入的时间，单位毫秒，不带单位，默认1s
            outTime: 1000
        }
    };

    /**
     * 弹出提示信息
     */
    return function () {
        //默认使用_TDefault属性，可以从show方法中传入修改
        //具体填入的值的类型可以参照_TDefault
        var properties = {
            xPosition: _TDefault.xyPosition.x,  //横轴位置，具体查看_XY_POSITION
            yPosition: _TDefault.xyPosition.y,  //纵轴位置
            xOffset: _TDefault.xyOffset.x,      //横轴偏移量，不带单位。具体查看_XY
            yOffset: _TDefault.xyOffset.y,      //同上
            width: _TDefault.wh.width,          //toast宽度
            height: _TDefault.wh.height,        //高度
            padding: _TDefault.padding,         //内边距
            fontSize: _TDefault.fontSize,       //字体大小
            color: _TDefault.color,             //字体颜色
            bgColor: _TDefault.bgColor,         //背景色
            borderRadius: _TDefault.borderRadius,//边框圆角，或者直接设置为固定值 "20px"
            duration: _TDefault.duration,       //可以显示几秒中，传入毫秒，不带单位
            isHTML: _TDefault.isHTML,           //是否开启插入HTML模式
            content: " ",                       //内容
            contentAlign: _TDefault.contentAlign,//内容位置
            fadeInTime: _TDefault.fade.inTime,  //显示淡入的时间，单位毫秒，不带单位
            fadeOutTime: _TDefault.fade.outTime
        };
        var _div = document.createElement("div");
        /**
         * 提供的显示方法
         * @param initObj
         */
        this.show = function (initObj) {
            init(initObj);
            initDiv();
            setContent();
            showing();
            showed();
            return this;
        };
        /**
         * 提供的关闭方法
         */
        this.close = function () {   //手动关闭
            _div.style.opacity = "0";
            var fadeOutTime = properties.fadeOutTime < 0 ? 0 : properties.fadeOutTime;
            setTimeout(function () {
                if (_div) _div.parentNode.removeChild(_div);
            }, fadeOutTime)
        };
        var close = function () {  //自动关闭
            if (properties.duration > 0) {
                var fadeOutTime = properties.fadeOutTime < 0 ? 0 : properties.fadeOutTime;
                setTimeout(function () {
                    _div.style.opacity = "0";
                    setTimeout(function () {
                        if (_div) _div.parentNode.removeChild(_div);
                    }, fadeOutTime);
                }, properties.duration);
            }
        };
        var init = function (initObj) {
            for (var key in initObj) (key in properties) && (properties[key] = initObj[key]);
        };
        var initDiv = function () {
            _div.style.position = "absolute";
            _div.style.display = "flex";
            _div.style.backgroundColor = properties.bgColor;
            _div.style.color = properties.color;
            _div.style.width = properties.width;
            _div.style.height = properties.height;
            _div.style.padding = properties.padding;
            _div.style.fontSize = properties.fontSize;
            _div.style.transition = "opacity " + (properties.fadeInTime < 0 ? 0 : properties.fadeInTime / 1000) + "s";
            _div.style.opacity = "0";
        };
        var setContent = function () {
            if (properties.isHTML) {
                _div.innerHTML = properties.content;
            } else {
                _div.innerText = properties.content;
            }
        };
        var setPosition = function () {
            _div.style.left = computedPosition("horizontal");
            _div.style.top = computedPosition("vertical");
            // if (properties.xOffset !== _TDefault.xyOffset.x) {
            _div.style.left = _div.offsetLeft + properties.xOffset + "px";
            // }
            // if (properties.yOffset !== _TDefault.xyOffset.y) {
            _div.style.top = _div.offsetTop + properties.yOffset + "px";
            // }
        };
        var showing = function () {
            document.body.appendChild(_div);
            if (properties.borderRadius === _BORDER_RADIUS.DISABLED) {
                _div.style.borderRadius = "0";
            } else if (properties.borderRadius === _BORDER_RADIUS.AUTO) {
                var h = _div.offsetHeight;
                _div.style.borderRadius = h + "px";
            } else {
                _div.style.borderRadius = properties.borderRadius;
            }
            var regx = /<img\s+/ig;
            var imgTags = properties.content.match(regx);
            if (imgTags && imgTags.length > 0) {
                var imgs = _div.getElementsByTagName("img");
                var counter = 0;
                for (var i = 0, len = imgs.length; i < len; i++) {
                    (function (i) {
                        imgs[i].onload = function () {
                            counter++;
                            if (counter === len) {
                                setPosition();
                                _div.style.opacity = "1";
                            }
                        }
                    })(i);
                }
            } else {
                setPosition();
                _div.style.opacity = "1";
            }
        };
        var showed = function () {
            close();
        };
        var computedPosition = function (type) {
            var xy = "0px";
            if (type === "horizontal") {
                var t = [_XY_POSITION.LEFT, _XY_POSITION.CENTER, _XY_POSITION.RIGHT];
                switch (t.indexOf(properties.xPosition)) {
                    case 0:
                        //表示居左
                        xy = _XY.x + "px";
                        break;
                    case 1:
                        xy = (document.documentElement.clientWidth - _div.offsetWidth) / 2 + "px";
                        break;
                    case 2:
                        xy = document.documentElement.clientWidth - _XY.x - _div.offsetWidth + "px";
                        break;
                    default:
                        xy = properties.xPosition;
                }
            } else if (type === "vertical") {
                var t = [_XY_POSITION.TOP, _XY_POSITION.CENTER, _XY_POSITION.BOTTOM];
                switch (t.indexOf(properties.yPosition)) {
                    case 0:
                        //表示居上
                        xy = _XY.y + "px";
                        break;
                    case 1:
                        xy = (document.documentElement.clientHeight - _div.offsetHeight) / 2 + "px";
                        break;
                    case 2:
                        xy = document.documentElement.clientHeight - _XY.y - _div.offsetHeight + "px";
                        break;
                    default:
                        xy = properties.yPosition;
                }
            }
            return xy;
        }
    }
})();