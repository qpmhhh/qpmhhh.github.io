function getModelHtml(mhtml,style){
    return `
        Content-Type: text/html; charset="utf-8"
            <!DOCTYPE html>
            <html>
            <head>
            <style>
                ${style}
            </style>
            </head>
            <body>
                ${mhtml}
            </body>
            </html>
        `
}
function getHtml(dom) {
    let _dom = dom || document;

    var canvass = _dom.querySelectorAll('canvas');
    var imgRepalce = _dom.querySelectorAll('.imgRepalce');
    let imageList = [];
    //canvass echars图表转为图片
    for(let k4 = 0; k4 < canvass.length; k4++) {
        let imageURL = canvass[k4].toDataURL("image/png");
        let img = document.createElement("img");
        img.src = imageURL;
        imageList.push(img.outerHTML);
    }
    //做分页
    //style="page-break-after: always"
    let pages = _dom.querySelectorAll('.result');
    for(let k5 = 0; k5 < pages.length; k5++) {
        pages[k5].setAttribute('style', 'page-break-after: always');
    }
    let result = _dom.outerHTML;
    //result = result.replace(/<colgroup>(.*?)<\/colgroup>/gi, '')
    //result = result.replace(/<canvas (.*?)><\/canvas>/gi, '')
    for(let i = 0; i < imgRepalce.length; i++) {
        result = result.replace(imgRepalce[i].outerHTML,
            '<div class="imgRepalce">' + imageList[i] + '</div>')
    }
    result = result.replace(/<img (.*?)>/gi, '<img $1></img>')
    result = result.replace(/<br>/gi, '<br></br>');
    result = result.replace(/<hr>/gi, '<hr></hr>');
    result = result.replace(/<script(.*?)>(.*?)<\/script>/gi, ' ');
    return "<body printmarginleft='72' printmarginright='72' printmargintop='56' printmarginbottom='56'>" + result + "</body>";
}
function getStyle(notPrint) {
    var str = '<head><meta charset="utf-8"></meta>',
        styles = document.querySelectorAll('style');
    for(var i = 0; i < styles.length; i++) {
        str += styles[i].outerHTML;
    }
    str += "<style>" + (notPrint ? notPrint : '.no-print') + "{display:none;}</style>";
    str += "<style>.results{width:100%!important;} .result .title{width:100%;}</style>";
    str += "<style>table{border-collapse: collapse;table-layout: fixed}</style>"
    str += "<style>table thead tr{ background-color: #f3f4f9;}</style>"
    str += "<style>table td,th{ font-size: 14px;padding: 1px 1px;border-width: 1px;border-style: solid;border-color: #d0d0d0;word-break: keep-all;white-space: nowrap;}</style>"
    str += "<style>h5{font-color: #2fb89e;}</style>"
    str += "</head>"
    return str;
}

