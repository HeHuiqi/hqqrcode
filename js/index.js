
const LOCAL_CODE_LIST_KEY = "hq_qrcodelist";

let codeList = [];
function remove(value) {
    const idx = codeList.indexOf(value);
    if (idx > -1) {
        codeList.splice(idx, 1);
    }
    updateLocalCodeList()
}

let qrcode_show_preview = document.getElementById('qrcode_show_preview');

let qrcode_show = document.getElementById("qrcode_show");

var qrcode = new QRCode(qrcode_show, {
    width: 300,
    height: 300,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});


let qrcode_input = document.getElementById('qrcode_input');
// 输入完成，按下enter或失去焦点时，键触发
qrcode_input.onchange = function (e) {
    let text = e.target.value;
    makeCodeFromText(text)

}
function makeCodeFromText(text) {
    if (text) {
        if (codeList.indexOf(text) > -1) {
            return;
        }
        makeCode(text);
        addCodeToList(text);
        saveCode(text)
    }

}
function makeCode(text) {
    if (text) {
        console.log('input---:' + text);
        qrcode_show_preview.style = 'display:none;'
        qrcode.makeCode(text);
    }
}

function loadLocaCodeList() {
    let codeListJson = localStorage.getItem(LOCAL_CODE_LIST_KEY);
    if (codeListJson != null) {
        codeList = JSON.parse(codeListJson);
    }
    return codeList;
}
function saveCode(code) {
    codeList.push(code);
    updateLocalCodeList();
}

function updateLocalCodeList() {
    localStorage.setItem(LOCAL_CODE_LIST_KEY, JSON.stringify(codeList));
    console.log("update-codeList:", codeList)

}
//生成二维码
let qrcode_make_button = document.getElementById('qrcode_make_button');
qrcode_make_button.onclick = function () {
    const text = qrcode_input.value;
    console.log('qrcode_input.value:', qrcode_input.value)
    makeCodeFromText(text);
}

let isScaning = false;
const qrcode_scan_video = document.getElementById('qrcode_scan_video');
const qrcode_scan_video_canvas = document.getElementById('qrcode_scan_video_canvas');
//扫描二维码
const qrcode_scan_button = document.getElementById('qrcode_scan_button');
qrcode_scan_button.onclick = function () {
    if (isScaning) {
        stopVideoStream()
    } else {
        startVideoStream()
    }
}
// 开始摄像头视频流
function startVideoStream() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: 168, height: 168 } })
        .then(function (stream) {
            qrcode_scan_video.srcObject = stream;
            qrcode_scan_video.onloadedmetadata = () => {
                isScaning = true;
                qrcode_scan_video.style.display = 'block';
                qrcode_scan_video.play();
                qrcode_scan_button.innerText = '停扫二维码';
                requestAnimationFrame(drawVideoCapture);
            };
        }).catch((err) => {
            stopVideoStream();
        });;
}
function stopVideoStream() {
    qrcode_scan_video.style.display = 'none';
    qrcode_scan_button.innerText = '扫描二维码';
    isScaning = false;
    qrcode_scan_video.pause();
    if (qrcode_scan_video.srcObject) {
        qrcode_scan_video.srcObject.getTracks()[0].stop();
    }
}
function drawVideoCapture() {
    if (qrcode_scan_video.readyState === qrcode_scan_video.HAVE_ENOUGH_DATA) {

        const width = qrcode_scan_video.videoHeight;
        const height = qrcode_scan_video.videoWidth;

        qrcode_scan_video_canvas.height = width;
        qrcode_scan_video_canvas.width = height;

        const canvas = qrcode_scan_video_canvas.getContext("2d", { willReadFrequently: true });
        canvas.drawImage(qrcode_scan_video, 0, 0, width, height);
        const imageData = canvas.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            // 扫描到二维码，输出结果
            // qrResult.innerText = code.data;
            qrcode_input.value = code.data;
            stopVideoStream();
        }
    }
    if (isScaning) {
        requestAnimationFrame(drawVideoCapture);
    }
}
//识别二维码
const qrcode_scan_image_button = document.getElementById('qrcode_scan_image_button');
qrcode_scan_image_button.onclick = function () {
    const qrcode_file_Input = document.getElementById('qrcode_file_Input');
    qrcode_file_Input.click();

    qrcode_file_Input.onchange = function () {
        const file = qrcode_file_Input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                console.log('img.onload');

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    // console.log('扫描结果: ' + code.data);
                    const result = code.data;
                    //将识别结果写入输入框
                    qrcode_input.value = result;
                    //在次生成一次
                    // makeCodeFromText(result)

                    new EpgToast().show({
                        xPosition: "center",
                        yPosition: "top",
                        content: code.data,
                        duration: 1000,
                    });

                } else {
                    new EpgToast().show({
                        xPosition: "center",
                        yPosition: "top",
                        content: '未识别到二维码',
                    });
                }
                //识别完，input值置空，否则选择同样的文件不会触发 change 事件
                qrcode_file_Input.value = ''

            };
        };

        reader.readAsDataURL(file);
    };


}
//保存二维码
let qrcode_save_button = document.getElementById('qrcode_save_button');
qrcode_save_button.onclick = function () {
    html2canvas(qrcode_show).then(canvas => {
        // 创建一个链接元素
        const link = document.createElement('a');
        link.href = canvas.toDataURL(); // 将canvas转为图片链接
        link.download = 'qrcode.png'; // 设定下载图片的名称
        link.click(); // 点击链接进行下载
    });
}

function addCodeToList(code) {
    let make_code_record_list = document.getElementById('make_code_record_list');

    let span = document.createElement('span');
    span.className = 'make-code-record-list-code';
    span.innerText = code;

    let button = document.createElement('button');
    button.className = "btn make-code-record-list-code-delete-btn";
    button.innerText = '删除';

    let li = document.createElement('li');
    li.appendChild(span);
    li.appendChild(button);

    li.onclick = function (e) {
        qrcode_input.value = code;
        makeCode(code);
    }

    button.onclick = function (e) {
        remove(code);
        make_code_record_list.removeChild(li);
        e.stopPropagation(); // 阻止事件冒泡传播,向父元素传递

    }
    const lis = make_code_record_list.childNodes;
    if (lis) {
        make_code_record_list.insertBefore(li, lis[0]);
    } else {
        make_code_record_list.appendChild(li);
    }
}
function showLocalCodeList() {
    loadLocaCodeList()
    for (const index in codeList) {
        addCodeToList(codeList[index], index);
    }
    console.log("init-codeList:", codeList)

}
showLocalCodeList();

//删除所有记录
const code_record_delete_button = document.getElementById('code_record_delete_button')
code_record_delete_button.addEventListener('click', () => {
    let make_code_record_list = document.getElementById('make_code_record_list');

    make_code_record_list.innerHTML = ''
    codeList = []
    updateLocalCodeList()

})



