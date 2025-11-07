let numToChinese = ["零","一","二","三","四","五","六","七","八","九","十"
	,"十一","十二","十三","十四","十五","十六","十七"
];
let h2Numbering = 0;
let h3Numbering = 0;
let h4Numbering = 0;
let h5Numbering = 0;
async function htmlToWord(dom) {
	let _dom = dom || document;
	let temp_list = [];
	let p_list = [];
	h2Numbering = 0;
	h3Numbering = 0;
	h4Numbering = 0;
	h5Numbering = 0;
	await extract_nodes(_dom,temp_list,p_list);
	const doc = new docx.Document({
	styles: {
        default: {
            heading1: {
                run: {
					font: "宋体",
                    size: "16pt",
                    bold: true,
                    color: "000000",
                },
                paragraph: {
					alignment: docx.AlignmentType.CENTER,
					indent: {
						firstLine: 0,
                    },
                    spacing: {
						before: 240,
                        after: 240,
                    },
                },
            },
            heading2: {
                run: {
					font: "宋体",
                    size: "12pt",
					bold: true,
                    color: "000000",
                },
                paragraph: {
					indent: {
						firstLine: 0,
                    },
                    spacing: {
                        before: 120,
                        after: 120,
                    },
                },
            },
			heading3: {
                run: {
					font: "宋体",
                    size: "12pt",
                    color: "000000",
                },
                paragraph: {
					indent: {
						firstLine: 0,
                    },
                    spacing: {
                        before: 0,
                        after: 0,
                    },
                },
            },
			heading4: {
                run: {
					font: "宋体",
                    size: "12pt",
                    color: "000000",
                },
                paragraph: {
					indent: {
						firstLine: 0,
                    },
                    spacing: {
                        before: 0,
                        after: 0,
                    },
                },
            },
            document: {
                run: {
                    size: "12pt",
                    font: "宋体",
                },
				paragraph: {
                    indent: {
						firstLine: 420,
                    },
                    spacing: {
						before: 0,
                        after: 0,
                    },
                },
            },
        },
		paragraphStyles: [
            {
                id: "figAndTable",
                name: "figAndTable",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
					size: "10pt",
                    font: "宋体",
                    color: "000000",
                },
                paragraph: {
                    alignment: docx.AlignmentType.CENTER,
                },
            },
			{
                id: "tableText",
                name: "tableText",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
					size: "12pt",
                    font: "宋体",
                    color: "000000",
                },
                paragraph: {
                    alignment: docx.AlignmentType.CENTER,
					indent: {
						firstLine: 0,
                    },
                    spacing: {
						before: 0,
                        after: 0,
                    },
                },
            },
			{
                id: "image",
                name: "image",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
					size: "12pt",
                    font: "宋体",
                    color: "000000",
                },
                paragraph: {
                    alignment: docx.AlignmentType.CENTER,
					indent: {
						firstLine: 0,
                    },
                    spacing: {
						before: 0,
                        after: 0,
                    },
                },
            },
        ]
    },
    sections: [
			{
				children: p_list,
			},
		],
	});
	docx.Packer.toBlob(doc).then(blob => {
		saveAs(blob, "output.docx");
	});
}
let stop_count = 0;


function nextParagraph(temp_list,p_list){
	if(temp_list.length==0){
		return false;
	}
	p = new docx.Paragraph({children: temp_list})
	temp_list.length = 0;
	p_list.push(p);
	return true;
}

function eleTableToChildren(t){
    var tableRows = [];
	var tChildren = t.getElementsByTagName("tr");
	if(tChildren.length!=0){
		for(tr of tChildren){
			var rowChildren = [];
			for(td of tr.children){
				var temp_list = [];
				var p_list = [];
				extract_nodes(td,temp_list,p_list);
				var cell = new docx.TableCell({
					children: [new docx.Paragraph({children: temp_list,style: "tableText",})],
					rowSpan: td.getAttribute('rowspan'),
				});
				rowChildren.push(cell);
			}
			var row = new docx.TableRow({
				children: rowChildren,
			});
			tableRows.push(row);
		}
	}
    const table = new docx.Table({
        rows: tableRows,
		alignment: docx.AlignmentType.CENTER,
    });
    return table;
}

async function fetchImageAsUint8Array(src) {
  const resp = await fetch(src, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
  const ab = await resp.arrayBuffer();
  return new Uint8Array(ab); // 二进制数据
}

async function eleImageToChildren(img,src="",width=0,height=0){
    if(src==""){
        src = img.getAttribute("src");
    }
    var imgw = img.naturalWidth ? img.naturalWidth:(width?width:400);
    var imgh = img.naturalHeight ? img.naturalHeight:(height?height:600);
    if(imgw>400){
        imgh = Math.round(400/imgw*imgh);
        imgw = 400;
    }
    // 可选：确保 img 能跨域加载（如果需要）
    try {
        const u8 = await fetchImageAsUint8Array(src); // 这里“阻塞”到 fetch 完成（使用 async/await）
        // 尝试根据 img 或响应类型设置 mime/type
        let mime = 'png';
        try {
            const ext = src.split('.').pop().toLowerCase();
            if (ext === 'jpg' || ext === 'jpeg') mime = 'jpg';
            else if (ext === 'gif') mime = 'gif';
            else if (ext === 'webp') mime = 'webp';
            else if (ext === 'bmp') mime = 'bmp';
        } catch(e){/* ignore */}
        const image = new docx.ImageRun({
            type: mime,
            data: u8,
            transformation: {
                width: imgw,
                height: imgh,
            },
        });
		const para = new docx.Paragraph({
                        children: [image],
						style: "image",
                    })
        return para;
    } catch (e) {
        console.error('获取图片失败：', e);
        // 返回一个占位段落，避免中断后续流程
        return new docx.Paragraph({ text: '[图片获取失败]' });
    }
}

async function eleIframeToChildren(f){
    const canvas = f.contentWindow.document.getElementById('shaftDiagramCanvas');
    var dataUrl = canvas.toDataURL("image/png");
    return await eleImageToChildren("",dataUrl,canvas.width,canvas.height);
}


async function extract_nodes(nodes,temp_list,p_list){
	// if(!["P","SPAN","H2","H3","H4"].includes(nodes.nodeName)){
	// 	console.log(nodes.nodeName);
	// }
	//遇到注释和脚本就不处理元素
	if(nodes.classList && nodes.classList.contains('text-annotation')){
		return;
	}else if(nodes.classList && nodes.classList.contains('warning')){
		return;
	}else if(nodes.nodeName == "SCRIPT"){
		return;
	}
	//特殊含子元素标签处理
	if(nodes.nodeName == "DETAILS"){
		return;
	}else if(nodes.nodeName == "H2"){
		nextParagraph(temp_list,p_list);
		h2Numbering+=1;
		h3Numbering=0;
		h4Numbering=0;
		h5Numbering=0;
		p_list.push(new docx.Paragraph({
			text: "".concat(numToChinese[h2Numbering],"、",nodes.innerText),
			heading: docx.HeadingLevel.HEADING_1}));
		return;
	}else if(nodes.nodeName == "H3"){
		nextParagraph(temp_list,p_list);
		h3Numbering+=1;
		h4Numbering=0;
		h5Numbering=0;
		p_list.push(new docx.Paragraph({
			text: "".concat(h2Numbering,".",h3Numbering," ",nodes.innerText),
			heading: docx.HeadingLevel.HEADING_2}));
		return;
	}else if(nodes.nodeName == "H4"){
		nextParagraph(temp_list,p_list);
		h4Numbering+=1;
		h5Numbering=0;
		p_list.push(new docx.Paragraph({
			text: "".concat(h2Numbering,".",h3Numbering,".",h4Numbering," ",nodes.innerText),
			heading: docx.HeadingLevel.HEADING_3}));
		return;
	}else if(nodes.nodeName == "H5"){
		nextParagraph(temp_list,p_list);
		h5Numbering+=1;
		p_list.push(new docx.Paragraph({
			text: "".concat("(",h5Numbering,")",nodes.innerText),
			heading: docx.HeadingLevel.HEADING_4}));
		return;
	}else if(nodes.nodeName == "FIGCAPTION"){
		nextParagraph(temp_list,p_list);
		p_list.push(new docx.Paragraph({
			text: nodes.innerText,
			style: "figAndTable"}));
		return;
	}else if(nodes.nodeName == "TABLE"){
		nextParagraph(temp_list,p_list);
		p_list.push(eleTableToChildren(nodes));
		return;
	}else if(nodes.nodeName == "SELECT"){
		temp_list.push(new docx.TextRun(nodes.options[nodes.selectedIndex].text));
		return;
	}else if(nodes.nodeName == "IMG"){
		nextParagraph(temp_list,p_list);
		p_list.push(await eleImageToChildren(nodes));
		return;
	}else if(nodes.nodeName == "IFRAME"){
		if(nodes.id.slice(0,7)=="zhou_tu"){
			nextParagraph(temp_list,p_list);
			p_list.push(await eleIframeToChildren(nodes));
		}
		return;
	}else if(nodes.nodeName == "MJX-CONTAINER"){
		omml_text = "";
		try{
			mml_nodes = nodes.getElementsByTagName("mjx-assistive-mml");
			for(mml_node of mml_nodes){
				mml_text = mml_node.innerHTML;
				omml_text = mml2omml(mml_text);
				math_obj = docx.ImportedXmlComponent.fromXmlString(omml_text).root[0];
				temp_list.push(math_obj);
			}
		}catch(e){
			try { console.log("可能的原始 MathML：", omml_text); } catch(err){ /* ignore */ }
			console.error("公式保存错误：", e);
		}
		return;
	}
	
	//无子元素标签处理
	if (nodes.childNodes.length!==0){
		for (var node of nodes.childNodes){
			await extract_nodes(node,temp_list,p_list);
		}
	}else{
		if(nodes.nodeName == "#text"){
			if(nodes.nodeValue.trim()==""){
				return;
			}
			temp_list.push(new docx.TextRun(nodes.nodeValue))
		}else if(nodes.nodeName == "BR"){
			nextParagraph(temp_list,p_list);
		}else if(nodes.nodeName == "INPUT"){
			temp_list.push(new docx.TextRun(nodes.value));
		}else if(nodes.nodeName == "SPAN"){
			//console.log(nodes);
			nextParagraph(temp_list,p_list);
		}else{
			//console.log(nodes);
		}
	}
	
}
