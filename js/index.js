
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
    width: 160,
    height: 160,
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
    makeCodeFromText(text);
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



