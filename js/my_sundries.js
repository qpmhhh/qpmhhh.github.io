let lot_pic_loading = 0;
let lot_pic_save_request = 0;
function decrement(text) {
    const cardinality = 9;
    let length = text.length;
    let col_num = 1;
    while (length > cardinality) {
        col_num += 1;
        length -= cardinality;
    }
    let result = [];
    const space = " ";
    length = text.length;
    if (col_num === 2) {
        if (length % 2 === 0) {
            const fillIn = space.repeat(9 - length / 2);
            return [col_num, [
                text.slice(0, length / 2) + fillIn,
                fillIn + text.slice(length / 2)
            ]];
        } else {
            const fillIn = space.repeat(9 - (length + 1) / 2);
            return [col_num, [
                text.slice(0, (length + 1) / 2) + fillIn,
                fillIn + " " + text.slice((length + 1) / 2)
            ]];
        }
    }
    for (let i = 0; i < col_num; i++) {
        if (i === col_num - 1 || col_num === 1) {
            result.push(text.slice(i * cardinality));
        } else {
            result.push(text.slice(i * cardinality, (i + 1) * cardinality));
        }
    }
    return [col_num, result];
}


async function getCopywriting(charaid = null, theme = null) {
    if (charaid && theme) {
        const specialRes = await fetch('/fortune/special_dec.json');
        const special = await specialRes.json();
        const arr = special[theme] || [];
        for (const i of arr) {
            if (i.charaid.includes(charaid)) {
                const desc = i.type[Math.floor(Math.random() * i.type.length)];
                for (const luck of special.luck_type) {
                    if (luck['good-luck'] === desc['good-luck']) {
                        return { title: luck.name, text: desc.content };
                    }
                }
            }
        }
    }
    const res = await fetch('/fortune/copywriting.json');
    const data = await res.json();
    const arr = data.copywriting;
    const luck = arr[Math.floor(Math.random() * arr.length)];
    return {
        title: luck['good-luck'],
        text: luck.content[Math.floor(Math.random() * luck.content.length)]
    };
}

async function randomBasemap(theme = 'random') {
    // 需要 themes.json 文件，结构见前述
    const res = await fetch('/fortune/img/themes.json');
    const themes = await res.json();
    let themeName = theme;
    if (theme === 'random') {
        const availableThemes = themes.filter(t => t.flag);
        themeName = availableThemes[Math.floor(Math.random() * availableThemes.length)].name;
    }
    const images = themes.find(t => t.name === themeName).images;
    const img = images[Math.floor(Math.random() * images.length)];
    return `/fortune/img/${themeName}/${img}`;
}

function renderFortune(imgUrl, title, text) {
    const img = new window.Image();
	const imgArr = imgUrl.split("/");
	const themeName = imgArr[3];
	const imgName = imgArr[4];
	// console.log(imgArr);
    img.crossOrigin = "anonymous";
    img.onload = function() {
		lot_pic_loading = 0;
		document.getElementById("yc_lot_loading").classList.remove("loader");
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // 标题
        const fontSizeTitle = 45;
		ctx.font = `bold ${fontSizeTitle}px Mamelon`;
		if(themeName==="jojo"){
			ctx.fillStyle = "#D11117";
			document.getElementById("yc_lot_cue2").innerHTML='感谢<span class="static-rainbow">SCUT_海吉星</span>提供的JOJO主题';
		}else{
			ctx.fillStyle = "#F5F5F5";
		}
        ctx.textAlign = "left";
        const image_font_center_title = [130, 101];
        const titleWidth = ctx.measureText(title).width;
        ctx.fillText(
            title,
            image_font_center_title[0] - titleWidth / 2,
            image_font_center_title[1] + fontSizeTitle / 2 - 10
        );

        // 正文分列排版
        const fontSizeText = 25;
		ctx.font = `${fontSizeText}px sakura`;
        ctx.fillStyle = "#323232";
        ctx.textAlign = "left";
        const image_font_center_text = [140, 297];
        const [slices, result] = decrement(text);

        for (let i = 0; i < slices; i++) {
            const font_height = result[i].length * (fontSizeText + 4);
            const x = Math.round(
                image_font_center_text[0]
                + (slices - 2) * fontSizeText / 2
                + (slices - 1) * 4
                - i * (fontSizeText + 4)
            );
            const y = Math.round(image_font_center_text[1] - font_height / 2);
            for (let j = 0; j < result[i].length; j++) {
                ctx.fillText(result[i][j], x, y + (fontSizeText + 4) * j + fontSizeText);
            }
        }

        document.getElementById('yc_lot').innerHTML = '';
        document.getElementById('yc_lot').appendChild(canvas);
		if(lot_pic_save_request){
			lot_pic_save_request = 0;
			document.getElementById('yc_lot').querySelector("canvas").toBlob(function(blob) {saveAs(blob, '今日幸运.png');});
		}
    };
    img.src = imgUrl;
}
async function generateFortune() {
	// document.getElementById("yc_lot_cue").innerText = "";
	// document.getElementById("yc_lot_cue2").innerText = "";
    lot_pic_loading = 1;
	document.getElementById("yc_lot_loading").classList.add("loader");
	// 1. 检查cookie
    const cookieVal = getCookie('yc_fortune_result');
    if (cookieVal) {
        // 解析变量并渲染
        const { imgUrl, title, text} = JSON.parse(cookieVal);
		document.getElementById("yc_lot_cue").innerText="今天已经抽过签了，为您展示抽签结果：";
        renderFortune(imgUrl, title, text);
        return;
    }

    // 2. 随机底图
    const imgUrl = await randomBasemap('random');
	const imgArr = imgUrl.split("/");
	const themeName = imgArr[3];
	const imgName = imgArr[4];
    // 3. 随机文案
    const { title, text } = await getCopywriting();
    // 4. 渲染
    renderFortune(imgUrl, title, text);
    // 5. 保存变量到cookie
    setCookie('yc_fortune_result', JSON.stringify({ imgUrl, title, text}), getToday2359());
}



function encodeAndShift(str) {
    let encoded = encodeURIComponent(str);
    let hexResult = '';
    for (let i = 0; i < encoded.length; i++) {
        let charCode = encoded.charCodeAt(i);
        let shift = (i + 1) % 8;
        let shiftedCode = ((charCode >> shift) | (charCode << (8 - shift))) & 0xFF;
        hexResult += shiftedCode.toString(16).padStart(2, '0');
    }
    return hexResult;
}
const targetEncoded = "385acd76";
const targetEncoded2 = "9251a65212194a389949a86329e47225210d";
const targetEncoded3 = "32db6c87";
const targetEncoded4 = "b45bec";
const targetEncoded5 = "b11bac1693";
const targetEncoded6 = '32588e16';

const logger_details = document.getElementById("logger_details");
const logger = document.getElementById("logger");
function check_new_logger(setCookitFlag=0){
	const expires = new Date();
	latest_logger_version = getCookie("yc_latest_logger_version");
	llv = logger_details.getElementsByClassName("update-version")[0].innerHTML;
	if(!latest_logger_version){
		if(setCookitFlag){
			expires.setDate(expires.getDate() + 365)
			setCookie("yc_latest_logger_version",
			llv,
			expires);
			logger.innerHTML = '点击展开/折叠更新日志';
		}else{
			logger.innerHTML = '点击展开/折叠更新日志<span class="logger_new">(new!)</span>';
		}
	}else if(llv !== latest_logger_version){
		// console.log(llv);
		// console.log(latest_logger_version);
		logger.innerHTML = '点击展开/折叠更新日志<span class="logger_new">(new!)</span>';
	}
}

//获取当前日期函数
function getNowFormatDate() {
  let date = new Date(),
    year = date.getFullYear(), //获取完整的年份(4位)
    month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate = date.getDate() // 获取当前日(1-31)
  if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
  if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
  document.getElementById("yc_date").innerText = `${year}年${month}月${strDate}日`;
  return `${year}-${month}-${strDate}`
}
getNowFormatDate();
// var xhr = new XMLHttpRequest();
// // 设置请求的方法、URL 和异步标志
// // xhr.open('GET',`https://www.36jxs.com/api/Commonweal/almanac?sun=${getNowFormatDate()}`, 'true');
// xhr.open('GET',`https://www.sojson.com/open/api/lunar/json.shtml?date=${getNowFormatDate()}`, 'true');

// // 注册监听函数来处理响应
// xhr.onreadystatechange = function() {
//   if (xhr.readyState === 4 && xhr.status === 200) {
//     var response = JSON.parse(xhr.responseText);
//     // 处理响应数据
//     console.log(response);
// 	document.getElementById("yc_yi").innerText = response["data"]["Yi"];
// 	document.getElementById("yc_ji").innerText = response["data"]["Ji"];
//   }
// };
// // 发送请求
// xhr.send();

var btn = document.getElementById("yc_ok");
btn.onclick = function() {
	const input = document.getElementById("yc_luckynum").value;
    const shiftedHex = encodeAndShift(input);
	//console.log(shiftedHex);
	if (
        shiftedHex === targetEncoded2
    ) {
        //console.log("高级用户");
		defense_dog = false;
		DesignData.latex_update_all(true);
    }
    // else if(shiftedHex === targetEncoded3){//docx
    //     if(!defense_dog){
    //         DesignData.latex_update_all(true);
    //         setTimeout(()=>{htmlToWord(document.querySelector(".markdown-body"))},3000);
    //     }
	// }else if(shiftedHex === targetEncoded4){//img
	// 	try{
	// 		document.getElementById('yc_lot').querySelector("canvas").toBlob(function(blob) {saveAs(blob, '今日幸运.png');});
	// 	}catch(error){
	// 		console.log("请抽签后再保存图片");
	// 		lot_pic_save_request = 1;
	// 	}
	// }else if(shiftedHex === targetEncoded5){//clear
	// 	// document.getElementById("yc_lot_cue").innerText="恭喜你发现bug，没错，用clear就能无限抽签：";
	// 	clearAllCookiesExcept();
	// }else if(shiftedHex === targetEncoded6){//data
	// 	if(!defense_dog){
    //         jxsj_web();
    //         // htmlToWord(document.getElementById("f421"),[],"数据.docx");
    //         // htmlToWord(document.querySelector(".markdown-body"),["data-t-only"],"表格数据.docx");
    //         htmlToWord(document.querySelector(".markdown-body"),["data-zhou-pic-only"],"轴的图.docx");
    //     }
	// }

	if(!lot_pic_loading){
		generateFortune();
	}
}