
const LOCAL_CODE_LIST_KEY = "hq_qrcodelist";
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
    if (text) {
        makeCode(text);
        addCodeToList(text);
        saveCode(text);
    }
}
function makeCode(text) {
    if (text) {
        qrcode_show_preview.style = 'display:none;'
        qrcode.makeCode(text);
    }
}

function loadLocaCodeList() {
    let codeListJson = localStorage.getItem(LOCAL_CODE_LIST_KEY);
    let codeList = [];
    if (codeListJson != null) {
        codeList = JSON.parse(codeListJson);
    }
    return codeList;
}
function saveCode(code) {

    let codeList = loadLocaCodeList()
    codeList.push(code);
    localStorage.setItem(LOCAL_CODE_LIST_KEY, JSON.stringify(codeList));
    console.log('codeList:', codeList);
}


//保存二维码
let qrcode_make_button = document.getElementById('qrcode_save_button');
qrcode_make_button.onclick = function () {
    html2canvas(qrcode_show).then(canvas => {
        // 创建一个链接元素
        const link = document.createElement('a');
        link.href = canvas.toDataURL(); // 将canvas转为图片链接
        link.download = 'code.png'; // 设定下载图片的名称
        link.click(); // 点击链接进行下载
    });
}

function addCodeToList(code) {
    let make_code_record_list = document.getElementById('make_code_record_list');
    let li = document.createElement('li');
    li.innerText = code;
    li.onclick = function (e) {
        const text = e.target.innerText;
        makeCode(text);
        qrcode_input.value = text;
    }
    const lis = make_code_record_list.childNodes;
    if (lis) {
        make_code_record_list.insertBefore(li, lis[0]);
    } else {
        make_code_record_list.appendChild(li);
    }
}
function showLocalCodeList() {
    let codeList = loadLocaCodeList()
    for (const index in codeList) {
        addCodeToList(codeList[index]);
    }

}
showLocalCodeList();



