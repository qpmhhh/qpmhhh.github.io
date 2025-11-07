
class CalculationTree {
	constructor(value = 0,parent = undefined) {
        this.node = [];
        this.value = value;
        if(parent !== undefined){
            parent.node.push(this);
            this.parent = parent;
        }
	}
    set_value(value) {
        this.value = value;
        return this.value;
    }
    get_value() {
        return this.value;
    }
    add_node(node){
        this.node.push(node);
        node.parent = this;
    }
    remove_node(node){
        this.node.filter(function(item) {return item !== node});
    }
}
class NodeExp extends CalculationTree {
	constructor(value = 1,parent = undefined) {
        super(value, parent);
	}
    get_value() {
        if(this.node.length !== 2){
            throw new Error(`幂函数的子节点必须仅有两个`);
        }
        this.value = this.node[0].get_value() ** this.node[1].get_value();
        return this.value;
    }
}
class NodeDiv extends CalculationTree {
	constructor(value = 1,parent = undefined) {
        super(value, parent);
	}
    get_value() {
        if(this.node.length !== 2){
            throw new Error(`除法的子节点必须仅有两个`);
        }
        this.value = this.node[0].get_value() / this.node[1].get_value();
        return this.value;
    }
}
class NodeNum extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
	}
    get_value() {
        return this.value;
    }
}
class NodeMul extends CalculationTree {
	constructor(value = 1,parent = undefined) {
        super(value, parent);
        this.sub_flag = 1;
	}
    get_value() {
        let temp = 1;
        let i = 0;
        for(i of this.node){
            temp = temp*i.get_value();
        }
        this.value = this.sub_flag*temp;
        return this.value;
    }
}
class NodeAdd extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.simflag = 0;
	}
    get_value() {
        if(this.simflag){
            this.value = this.node[0].get_value();
            return this.value;
        }
        let temp = 0;
        let i = 0;
        for(i of this.node){
            temp = temp+i.get_value();
        }
        this.value = temp;
        return this.value;
    }
}
class NodeSin extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.simflag = 0;
	}
    get_value() {
        if(this.node.length !== 1){
            throw new Error(`sin的子节点必须仅有一个`);
        }
        this.value = Math.sin(this.node[0].get_value()/180*Math.PI);
        return this.value;
    }
}
class NodeCos extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.simflag = 0;
	}
    get_value() {
        if(this.node.length !== 1){
            throw new Error(`cos的子节点必须仅有一个`);
        }
        this.value = Math.cos(this.node[0].get_value()/180*Math.PI);
        return this.value;
    }
}
class NodeTan extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.simflag = 0;
	}
    get_value() {
        if(this.node.length !== 1){
            throw new Error(`tan的子节点必须仅有一个`);
        }
        this.value = Math.tan(this.node[0].get_value()/180*Math.PI);
        return this.value;
    }
}
class NodeAtan extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.simflag = 0;
	}
    get_value() {
        if(this.node.length !== 1){
            throw new Error(`atan的子节点必须仅有一个`);
        }
        this.value = Math.atan(this.node[0].get_value())*180/Math.PI;
        return this.value;
    }
}
class NodeAsin extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.simflag = 0;
	}
    get_value() {
        if(this.node.length !== 1){
            throw new Error(`asin的子节点必须仅有一个`);
        }
        this.value = Math.asin(this.node[0].get_value())*180/Math.PI;
        return this.value;
    }
}
class NodeAcos extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.simflag = 0;
	}
    get_value() {
        if(this.node.length !== 1){
            throw new Error(`acos的子节点必须仅有一个`);
        }
        this.value = Math.acos(this.node[0].get_value())*180/Math.PI;
        return this.value;
    }
}
class NodeSim extends CalculationTree {
	constructor(value = 0,parent = undefined) {
        super(value, parent);
        this.ranges = [0,0];
	}
    get_value() {
        if(this.node.length !== 2){
            throw new Error(`范围符号的子节点必须仅有两个`);
        }
        this.ranges[0] = this.node[0].get_value();
        this.ranges[1] = this.node[1].get_value();
        this.value = "".concat(parseFloat(this.ranges[0].toFixed(3)).toString()," \\sim ",parseFloat(this.ranges[1].toFixed(3)).toString());
        return this.value;
    }
}
class DesignData{
	constructor(id, latex_sign, value=0, unit="") {
		this.id = id;
		this.ele = document.getElementById(id);
		this.ls = latex_sign;
		this.value = value;
        this.unit = unit;
        this.parents = [];
        this.children = [];
        this.pre_update_flag = false;
        this.latex_update_flag = true;
		this.duplicate_check();
	}
    static all_id = {};
	static all_ls = {};
    static DP = 0;
    static is_waiting = false;
	duplicate_check(){
        if(this.ls!==""){
            if(DesignData.all_ls[this.ls]!==undefined){
                throw new Error(`实例${this.id}中${this.ls}已存在，请使用其他符号`);
            }else{
                DesignData.all_ls[this.ls] = this;
            }
        }
		if(this.id!==""){
            if(DesignData.all_id[this.id]!==undefined){
                throw new Error(`唯一标识符${this.id}已存在，请使用其他id`);
            }else{
                DesignData.all_id[this.id] = this;
            }
        }
        
	}
    get_ls(ls){
        if(DesignData.all_ls[ls]===undefined){
			throw new Error(`实例${this.id}中${ls}未定义`);
		}else{
			return DesignData.all_ls[ls];
		}
    }
	set_value(value){
		this.value = value;
	}
	get_value(){
		return this.value;
	}
	set_children_update_flag(){
        let child = undefined;
        for(child of this.children){
            if(!child.pre_update_flag){
                child.pre_update_flag = true;
                child.set_children_update_flag();
            }
        }
    }
    before_update(){
        return;
    }
    latex_update(){
        return this.get_value();
    }
    after_update(){
        return;
    }
    add_child(data){
        this.children.push(data);
        data.parents.push(this);
    }
    add_parent(data){
        this.parents.push(data);
        data.children.push(this);
    }
    static latex_update_all(force=false){
        let data = undefined;
        let math_temp = [];
        for(data of Object.values(DesignData.all_id)){
            if(data.pre_update_flag || force){
                data.pre_update_flag = false;
                data.latex_update();
                if(data.latex_update_flag){
                    math_temp.push(data.ele);
                }
                if(DesignData.is_waiting){
                    break;
                }
            }
        }
        window.MathJax.typesetPromise(math_temp);
    }
    static setting_DP(n){
        if((typeof n)==="string"){
            return n;
        }else{
            return parseFloat(n.toFixed(DesignData.DP)).toString();
        }
    }
}
class DataMiddle{
	constructor(id, latex_sign, value=0, unit="") {
        this.id = id;
		this.ls = latex_sign;
		this.value = value;
        this.unit = unit;
        this.parents = [];
        this.children = [];
        this.pre_update_flag = false;
        this.latex_update_flag = false;
        this.duplicate_check();
    }
    duplicate_check(){
        if(this.id!==""){
            if(DesignData.all_id[this.id]!==undefined){
                throw new Error(`唯一标识符${this.id}已存在，请使用其他id`);
            }else{
                DesignData.all_id[this.id] = this;
            }
        }
        if(this.ls!==""){
            if(DesignData.all_ls[this.ls]!==undefined){
                throw new Error(`实例${this.id}中${this.ls}已存在，请使用其他符号`);
            }else{
                DesignData.all_ls[this.ls] = this;
            }
        }
        
    }
    set_value(v){
        this.value = v;
        this.set_children_update_flag();
        return this.value;
    }
    get_value(){
        return this.value;
    }
    set_children_update_flag(){
        let child = undefined;
        for(child of this.children){
            if(!child.pre_update_flag){
                child.pre_update_flag = true;
                child.set_children_update_flag();
            }
        }
    }
    add_child(data){
        this.children.push(data);
        data.parents.push(this);
    }
    add_parent(data){
        this.parents.push(data);
        data.children.push(this);
    }
    latex_update(){
        this.before_update();
        this.value = this.get_value();
        this.after_update();
        return this.value;
    }
    before_update(){

    }
    after_update(){

    }
    latex_update_all(force=false){
        DesignData.latex_update_all(force);
    }
}
class DataText{
	constructor(id, latex_sign, value=0, unit="") {
        this.id = id;
        this.ele = document.getElementById(id);
		this.ls = latex_sign;
		this.value = value;
        this.unit = unit;
        this.parents = [];
        this.children = [];
        this.pre_update_flag = false;
        this.latex_update_flag = true;
        this.duplicate_check();
    }
    duplicate_check(){
        if(this.id!==""){
            if(DesignData.all_id[this.id]!==undefined){
                throw new Error(`唯一标识符${this.id}已存在，请使用其他id`);
            }else{
                DesignData.all_id[this.id] = this;
            }
        }
        if(this.ls!==""){
            if(DesignData.all_ls[this.ls]!==undefined){
                throw new Error(`实例${this.id}中${this.ls}已存在，请使用其他符号`);
            }else{
                DesignData.all_ls[this.ls] = this;
            }
        }
    }
    get_value(){
        return this.value;
    }
    set_children_update_flag(){
        let child = undefined;
        for(child of this.children){
            if(!child.pre_update_flag){
                child.pre_update_flag = true;
                child.set_children_update_flag();
            }
        }
    }
    add_child(data){
        this.children.push(data);
        data.parents.push(this);
    }
    add_parent(data){
        this.parents.push(data);
        data.children.push(this);
    }
    latex_update(){
        this.before_update();
        this.ele.textContent = this.value;
        this.after_update();
        return this.value;
    }
    before_update(){

    }
    after_update(){
        
    }
    latex_update_all(force=false){
        DesignData.latex_update_all(force);
    }
}
class DataDisplay{
	constructor(id, design_data, multi_line_flag=0) {
		this.dc = design_data;
        this.id = id;
		this.ele = document.getElementById(id);
		this.ls = design_data.ls;
		this.value = design_data.value;
        this.unit = design_data.unit;
        this.multi_line_flag = multi_line_flag;
        this.pre_update_flag = false;
        this.latex_update_flag = true;
        this.duplicate_check();
        this.parents = [design_data];
        this.children = [];
        design_data.children.push(this);
    }
    duplicate_check(){
        if(this.id!==""){
            if(DesignData.all_id[this.id]!==undefined){
                throw new Error(`唯一标识符${this.id}已存在，请使用其他id`);
            }else{
                DesignData.all_id[this.id] = this;
            }
        }
        
    }
    latex_update(){
        this.value = this.dc.value;
        if(this.multi_line_flag){
            this.ele.textContent = "".concat("$$",
                this.ls," = ",DesignData.setting_DP(this.value),this.unit,"$$");
        }else{
            this.ele.textContent = "".concat("$",
                this.ls," = ",DesignData.setting_DP(this.value),this.unit,"$");
        }
        return this.value;
    }
    set_children_update_flag(){
        return;
    }
}
class DataIframe{
    constructor(id,src="",is_waiting = true) {
        this.id = id;
        this.load_flag = false;
        this.ele = document.getElementById(id);
        this.ele.src = src;
        this.ele.addEventListener("load", this.set_load_flag());
        this.pre_update_flag = false;
        this.latex_update_flag = false;
        this.is_waiting_flag = is_waiting;
        this.send_data = undefined;
        this._send_data = undefined;
        this.children = [];
        this.parents = [];
        this.duplicate_check();
    }
    set_load_flag(){
        if(this.load_flag){
            this.ele.contentWindow.postMessage(this._send_data, "*");
        }else{
            this.load_flag = true;
        }
    }
    duplicate_check(){
        if(this.id!==""){
            if(DesignData.all_id[this.id]!==undefined){
                throw new Error(`唯一标识符${this.id}已存在，请使用其他id`);
            }else{
                DesignData.all_id[this.id] = this;
            }
        }
        
    }
    latex_update() {
        this.before_update();
        if(this.is_waiting_flag){
            DesignData.is_waiting = true;
        }
        this.update_send_data();
        if (this.load_flag){
            this.ele.contentWindow.postMessage(this._send_data, "*");
        } else {
            this.load_flag = true;
        }
        this.after_update();
        return this.value;
    }
    before_update(){

    }
    after_update(){

    }
    update_send_data(){
        this._send_data = this.object_to_value(this.send_data);
        return this._send_data;
    }
    object_to_value(o){
        if(o.constructor.name.includes("Data")){
            return Math.round(o.get_value()*100)/100;
        }else if(Array.isArray(o)){
            var temp = [];
            for(var i of o){
                temp.push(this.object_to_value(i));
            }
            return temp;
        }else if(typeof o === "string"){
            return o;
        }else if(!isNaN(o)){
            return o;
        }else{
            var temp = {};
            for(var key in o){
                temp[key] = this.object_to_value(o[key]);
            }
            return temp;
        }
    }
    set_children_update_flag(){
        return;
    }
}
class DataWarning extends DataDisplay{
	constructor(id, design_data, comparer="<", com_num=0, warning_text="") {
        super(id, design_data);
        this.comparer = comparer;
        this.com_num = com_num;
        this.wt = warning_text;
    }
    latex_update(){
        var com_num;
        this.value = this.dc.value;
        if(!isNaN(this.com_num)){
            com_num = this.com_num;
        }else{
            com_num = this.com_num.value;
        }
        if(this.comparer=="<"){
            if(this.value < com_num){
                this.ele.innerHTML = this.wt;
            }else{
                this.ele.innerHTML = "";
            }
        }else if(this.comparer==">"){
            if(this.value > com_num){
                this.ele.innerHTML = this.wt;
            }else{
                this.ele.innerHTML = "";
            }
        }else{
            throw new Error(`无法处理实例${this.id}的比较符号${this.comparer}`);
        }
        return this.value;
    }
    set_children_update_flag(){
        return;
    }
}
class DataInput extends DesignData{
	constructor(id, latex_sign, value=0, unit="") {
		super(id, latex_sign, value, unit);
        this.latex_update_flag = false;
        this.user_update_flag = false;
        this.cookie_flag = false;
		this.get_value();
	}
    get_value(){
        const v = getCookie(this.id+"_value");
        if(v!==null){
            this.ele.value = parseFloat(v);
            this.value = parseFloat(v);
            this.cookie_flag = true;
        }else{
            this.value = parseFloat(this.ele.value);
            this.cookie_flag = false;
        }
		return this.value;
	}
    latex_update(){
        this.before_update();
        this.get_value();
        this.after_update();
        return this.value;
    }
}
class DataSelect extends DesignData{
	constructor(id, latex_sign, value=0, unit="") {
		super(id, latex_sign, value, unit);
        this.latex_update_flag = false;
        this.cookie_flag = false;
        this.ele.options.add(new Option("占位符","0"));
        this.options = [];
        this.selected = 0;
        this.user_update_flag = false;
        this.options_change_flag = false;
		this.get_value();
	}
    get_value(){
        const v = getCookie(this.id+"_value");
        var i=0;
        if(v!==null){
            for (i = 0; i < this.ele.length; i++) {
                //console.log(e.options[i].text);
                if(v==this.ele.options[i].text){
                    this.selected = i;
                    this.value = this.ele.options[this.selected].text;
                    this.cookie_flag = true;
                    break;
                }else{
                    this.value = this.ele.options[this.selected].text;
                    this.cookie_flag = false;
                }
            }
        }else{
            this.value = this.ele.options[this.selected].text;
            this.cookie_flag = false;
        }
        if(!isNaN(this.value)){
            this.value = parseFloat(this.value);
        }
		return this.value;
	}
    latex_update(){
        this.before_update();
        if(this.user_update_flag){
            this.selected = this.ele.selectedIndex;
            this.user_update_flag = false;
        }
        if(this.options_change_flag){
            this.ele.options.length = 0;
            let i = 0;
            for(i in this.options){
                this.ele.options.add(new Option(this.options[i],i));
            }
            this.options_change_flag = false;
        }
        this.get_value();
        this.ele.options[this.selected].selected = true;
        this.after_update();
        return this.value;
    }
}

class DataTable extends DesignData{
	constructor(id, latex_sign, withUnit=true) {
		super(id, latex_sign);
        this.table_head = [];
        this.table_rows = [];
        this.withUnit = withUnit;
        this.rows_num = 0;
        this.columns_num = 0;
	}
    set_rows(rows){
        this.table_rows = rows;
        this.table_init();
    }
    table_init(){
        this.ele.innerHTML = "";
        let row = undefined;
        let cell = undefined;
        if(this.table_head.length!==0){
            var tr_h = document.createElement('tr');
            for (cell of this.table_head) {
                var td_h = document.createElement('td');
                td_h.textContent = cell;
                tr_h.appendChild(td_h);
            }
            this.ele.appendChild(tr_h);
        }

        for (row of this.table_rows) {
            var tr = document.createElement('tr');
            for (cell of row) {
                var td = document.createElement('td');
                var temp = this.object_to_value(cell);
                temp.attach_td(td);
                tr.appendChild(td);
            }
            this.ele.appendChild(tr);
        }
    }
    latex_update(){
        this.before_update();
        for(var child of this.children){
            child.latex_update();
        }
        this.after_update();
        window.MathJax.typesetPromise([this.ele]);
        return this.get_value();
    }
    object_to_value(o){
        if(o.constructor.name.includes("Data")){
            var temp = new DataTableCell(Math.random().toString(36).substring(2),Math.random().toString(36).substring(2),o,false,this.withUnit);
            o.add_child(temp);
            this.add_child(temp);
            return temp;
        }else if(typeof o === "string"){
            var temp = new DataTableCell(Math.random().toString(36).substring(2),Math.random().toString(36).substring(2),o,false,this.withUnit);
            this.add_child(temp);
            return temp;
        }else if(!isNaN(o)){
            var temp = new DataTableCell(Math.random().toString(36).substring(2),Math.random().toString(36).substring(2),o,false,this.withUnit);
            this.add_child(temp);
            return temp;
        }else if(Array.isArray(o)){
            var temp = new DataTableCell(Math.random().toString(36).substring(2),Math.random().toString(36).substring(2),o,true,this.withUnit);
            this.add_child(temp);
            return temp;
        }else{
            console.log("Dict");
            return o;
        }
    }
}
class DataTableCell extends DataMiddle{
	constructor(id, latex_sign, value=undefined, isArray = false, withUnit=true) {
        super(id, latex_sign, value);
        this.isArray  = isArray;
        this.td = undefined;
        this.withUnit = withUnit;
        if(value.constructor.name.includes("Formula")&&value.id==""){
            this.attach_parents_children(this.value);
        }
        if(isArray){
            for(var o of this.value){
                if(typeof o === "string"){
                    continue;
                }else if(!isNaN(o)){
                    continue;
                }else{
                    if(o.constructor.name.includes("Formula")&&o.id==""){
                        this.attach_parents_children(o);
                    }else{
                        o.add_child(this);
                    }
                }
            }
        }
    }
    attach_parents_children(o){
        let i=undefined;
        for(i of o.parents){
            if((typeof i)!=="string"){
                i.children.filter(item => item !== o);
                i.add_child(this);
            }
        }
        o.parents = [];
    }
    attach_td(td){
        this.td = td;
    }
    latex_update(){
        var temp = "";
        if(this.isArray){
            for(var o of this.value){
                temp+=this.value_to_string(o);
            }
        }else{
            temp = this.value_to_string(this.value);
        }
        this.td.textContent = temp;
    }
    value_to_string(o){
        if(Array.isArray(o)){
            throw new Error("DataTableCell只能处理一维数组");
        }
        var temp = "";
        if(typeof o === "string"){
            temp = o;
        }else if(!isNaN(o)){
            temp = DesignData.setting_DP(o).toString();
        }else{
            o.get_value();
            if(o.unit=="φ"){
                temp = "φ"+DesignData.setting_DP(o.value);
            }else{
                if(this.withUnit){
                    temp = DesignData.setting_DP(o.value)+o.unit;
                }else{
                    temp = DesignData.setting_DP(o.value);
                }
            }
        }
        return temp;
    }
}
class DataConst extends DesignData{
	constructor(id, latex_sign, value=0, unit="") {
		super(id, latex_sign, value, unit);
        this.latex_update_flag = 0;
	}
    get_value(){
		return this.value;
	}
    latex_update(){
        return this.get_value();
    }
}
const DATA_PI = new DataConst("DATA_PI","\\pi",3.141592654);
const SUB_FLAG = 0x01;
class DataFormula extends DesignData{
	constructor(id, latex_sign, connector="", formula="", unit="", value=0, addition_latex_list="") {
		super(id, latex_sign, value, unit);
        if(id==""){
            this.latex_update_flag = false;
        }
        this.main_node = new NodeAdd();
        this.calc_stack = [this.main_node];
        this.formula = formula;
        this.connector = connector;
        this.addition_latex_list = addition_latex_list;
        this.num_substitution_list = [];
		this.parse_latex_formula(formula,this.calc_stack,this.num_substitution_list);
        this.attach_parents_children();
        //console.log(this);
	}
    // update_latex_formula(formula){
    //     this.main_node = new NodeAdd();
    //     this.calc_stack = [this.main_node];
    //     this.formula = formula;
    //     this.deattach_parents_children();
    //     this.num_substitution_list = [];
    //     this.parse_latex_formula(formula,this.calc_stack,this.num_substitution_list);
    //     this.attach_parents_children();
    // }
    parse_latex_formula(formula,stack=[],ssl=[],flags=0){
		if((typeof formula)!=="string"){
			throw new Error(`实例${this.id}中公式${formula}不是字符串`);
		}

		const f = formula.trim();//去掉首尾空白
        if(f.length===0){
            return ["",stack];
        }
        if(stack.length===0){
            stack.push(new NodeAdd());
        }
        const reg_command = /(^\\[a-z]+)/;//匹配指令
        const reg_num = /(^[\d\.]+)/;//匹配数字
        const reg_single_char = /(^\w([\_\^](?:\w|\{.*?\}))*)/;//匹配单变量
        const reg_multi_char = /(^\\[a-zD]+([\_\^](?:\w|\{.*?\}))+)/;//匹配带上下标的指令
        let temp = [];

        if(f.slice(0,11)=="\\Delta P_0"){
            temp = this.parse_char(f.slice(0,11),f,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }else if(f.slice(0,15)=="[\\sigma_{H}]_{g"){
            temp = this.parse_char(f.slice(0,17),f,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }else if(f.slice(0,9)=="[\\sigma_{"){
            temp = this.parse_char(f.slice(0,14),f,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }
        
        if(f[0]==='('){
            let f_stack = [];
            let i=0;
            let sub_f = "";
            // 1. Find matching parenthesis
            for(;i<f.length;i++){
                if(f[i]==="("){
                    f_stack.push("(");
                }else if(f[i]===")"){
                    f_stack.pop();
                }
                if(f_stack.length===0){
                    sub_f = f.slice(1,i);
                    break;
                }
            }

            // Create a temporary ssl for the sub-formula to get the node
            let sub_ssl = [];
            const baseNode = this.parse_latex_formula(sub_f,[],sub_ssl)[1][0];

            // 2. Check for exponent after parenthesis
            let remaining_formula = f.slice(i+1);
            const reg_sup = /^\s*\^\{?([^\}]+)\}?/; // Regex to find exponent
            let sup_match = remaining_formula.match(reg_sup);

            let finalNode = baseNode;
            let exponent_node_for_calc;
            let exponent_ssl_for_print = [];

            if (sup_match) {
                const ne = new NodeExp();
                ne.add_node(baseNode);

                const exponent_str = sup_match[1];
                
                if(!isNaN(exponent_str)){
                    exponent_node_for_calc = new NodeNum(parseFloat(exponent_str));
                    exponent_ssl_for_print.push(exponent_str);
                }else{
                    exponent_node_for_calc = this.get_ls(exponent_str);
                    exponent_ssl_for_print.push(this.get_ls(exponent_str));
                }
                ne.add_node(exponent_node_for_calc);
                finalNode = ne;
                remaining_formula = remaining_formula.slice(sup_match[0].length);
            }

            // 3. Add the final node to the tree (inside a NodeMul)
            if (stack[stack.length - 1].constructor.name !== "NodeMul") {
                let mul = new NodeMul();
                if (flags & SUB_FLAG) {
                    mul.sub_flag *= -1;
                }
                stack[stack.length - 1].add_node(mul);
                stack.push(mul);
            } else {
                if (ssl[ssl.length - 1]!=="\\times") {
                    ssl.push("\\times");
                }
                if (flags & SUB_FLAG) {
                    stack[stack.length - 1].sub_flag *= -1;
                }
            }
            
            // 4. Add the node and update the main SSL
            ssl.push("(");
            ssl.push(...sub_ssl);
            ssl.push(")");
            if (sup_match) {
                ssl.push("^");
                if (sup_match[0].includes('{')) ssl.push('{');
                ssl.push(...exponent_ssl_for_print);
                if (sup_match[0].includes('{')) ssl.push('}');
            }
            stack[stack.length-1].add_node(finalNode);


            return this.parse_latex_formula(remaining_formula, stack, ssl, 0);
        }else if(reg_command.test(f) && !reg_multi_char.test(f)){
            temp = this.parse_command(f.match(reg_command)[0],f,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }else if(reg_num.test(f)){
            temp = this.parse_char(f.match(reg_num)[0],f,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }else if(reg_single_char.test(f)){
            temp = this.parse_char(f.match(reg_single_char)[0],f,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }else if(reg_multi_char.test(f)){
            temp = this.parse_char(f.match(reg_multi_char)[0],f,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }else if(f[0]=='+'){
            ssl.push("+");
            if(stack[stack.length-1].constructor.name!=="NodeAdd"){
                stack.pop();
                if(stack[stack.length-1].constructor.name!=="NodeAdd"){
                    stack.push(new NodeAdd());
                }
            }
            return this.parse_latex_formula(f.slice(1),stack,ssl);
        }else if(f[0]=='-'){
            ssl.push("-");
            if(stack[stack.length-1].constructor.name!=="NodeAdd"){
                stack.pop();
                if(stack[stack.length-1].constructor.name!=="NodeAdd"){
                    stack.push(new NodeAdd());
                }
            }
            if(flags&SUB_FLAG){
                return this.parse_latex_formula(f.slice(1),stack,ssl);
            }else{
                return this.parse_latex_formula(f.slice(1),stack,ssl,SUB_FLAG);
            }
        }else if(f[0]=='/'){
            //console.log(f[0]);
            ssl.push("/");
            return this.parse_latex_formula(f.slice(1),stack,ssl);
        }else if(f[0]=='°'){
            //console.log(f[0]);
            ssl.push("°");
            return this.parse_latex_formula(f.slice(1),stack,ssl);
        }else{
            throw new Error(`遇到无法解析的字符：${f}`);
        }
	}
    stack_push_nodemul(stack,flags=0){
        if (stack[stack.length - 1].constructor.name !== "NodeMul") {
            let mul = new NodeMul();
            if (flags & SUB_FLAG) {
                mul.sub_flag *= -1;
            }
            stack[stack.length - 1].add_node(mul);
            stack.push(mul);
        } else {
            if (flags & SUB_FLAG) {
                stack[stack.length - 1].sub_flag *= -1;
            }
        }
    }
    parse_trigonometric_command(c,f_remain,stack,ssl,flags=0){
        let node = "";
        switch(c){
            case "\\sin":
                node = new NodeSin();
                break;
            case "\\cos":
                node = new NodeCos();
                break;
            case "\\tan":
                node = new NodeTan();
                break;
            case "\\arcsin":
                node = new NodeAsin();
                break;
            case "\\arccos":
                node = new NodeAcos();
                break;
            case "\\arctan":
                node = new NodeAtan();
                break;
            default:
                console.log(c);
                break;
        }
        // if (ssl[ssl.length - 1]!=="\\times" && ssl.length!=0) {
        //     ssl.push("\\times");
        // }
        this.stack_push_nodemul(stack,flags);
        ssl.push(c);
        let s_content = "";
        let s_stack = [];
        let i=0;
        stack[stack.length-1].add_node(node);
        for(;i<f_remain.length;i++){
            if(f_remain[i]==="("){
                s_stack.push("(");
            }else if(f_remain[i]===")"){
                s_stack.pop();
            }
            if(s_stack.length===0){
                s_content = f_remain.slice(1,i);
                ssl.push("(");
                node.add_node(this.parse_latex_formula(s_content,[],ssl)[1][0]);
                ssl.push(")");
                break;
            }
        }
        return i;
    }
    parse_command(c,formula,stack,ssl,flags=0){
        //console.log(c);
        let f_remain = formula.slice(c.length);
        let command_end = 0;
        let node=undefined;

        if(c==="\\frac"){
            this.stack_push_nodemul(stack,flags);
            ssl.push(c);
            let f_top = "";
            let f_bottom = "";
            let f_stack = [];
            let i=0;
            let top_end=0;
            node = new NodeDiv();
            stack[stack.length-1].add_node(node);
            for(;i<f_remain.length;i++){
                if(f_remain[i]==="{"){
                    f_stack.push("{");
                }else if(f_remain[i]==="}"){
                    f_stack.pop();
                }
                if(f_stack.length===0){
                    top_end = i+1;
                    f_top = f_remain.slice(1,i);
                    ssl.push("{");
                    node.add_node(this.parse_latex_formula(f_top,[],ssl)[1][0]);
                    ssl.push("}");
                    break;
                }
            }
            for(i=top_end;i<f_remain.length;i++){
                if(f_remain[i]==="{"){
                    f_stack.push("{");
                }else if(f_remain[i]==="}"){
                    f_stack.pop();
                }
                if(f_stack.length===0){
                    f_bottom = f_remain.slice(top_end+1,i);
                    ssl.push("{");
                    node.add_node(this.parse_latex_formula(f_bottom,[],ssl)[1][0]);
                    ssl.push("}");
                    break;
                }
            }
            command_end = i+1;
            //console.log(f_top);
            //console.log(f_bottom);
        }else if(c==="\\times"){
            ssl.push("\\times");
            command_end = 0;
        }else if(c==="\\sqrt"){
            this.stack_push_nodemul(stack,flags);
            ssl.push(c);
            node = new NodeExp();
            let s_content = "";
            let s_stack = [];
            let i=0;
            let times = 2;
            stack[stack.length-1].add_node(node);
            if(f_remain[0]=="["){
                const reg_num = /(^[\d\.]+)/;//匹配数字
                times = f_remain.slice(1).match(reg_num)[0];
                f_remain = f_remain.slice(times.length+2);
                ssl.push("["+times+"]");
                times = parseFloat(times);
                // console.log(times);
                // console.log(f_remain);
            }
            for(;i<f_remain.length;i++){
                if(f_remain[i]==="{"){
                    s_stack.push("{");
                }else if(f_remain[i]==="}"){
                    s_stack.pop();
                }
                if(s_stack.length===0){
                    s_content = f_remain.slice(1,i);
                    ssl.push("{");
                    node.add_node(this.parse_latex_formula(s_content,[],ssl)[1][0]);
                    ssl.push("}");
                    break;
                }
            }
            node.add_node(new NodeNum(1/times));
            command_end = i+1;
            //console.log(s_content);
        }else if(c=="\\sin"){
            let i = this.parse_trigonometric_command(c,f_remain,stack,ssl,flags);
            command_end = i+1;
        }else if(c=="\\cos"){
            let i = this.parse_trigonometric_command(c,f_remain,stack,ssl,flags);
            command_end = i+1;
        }else if(c=="\\tan"){
            let i = this.parse_trigonometric_command(c,f_remain,stack,ssl,flags);
            command_end = i+1;
        }else if(c=="\\arcsin"){
            let i = this.parse_trigonometric_command(c,f_remain,stack,ssl,flags);
            command_end = i+1;
        }else if(c=="\\arccos"){
            let i = this.parse_trigonometric_command(c,f_remain,stack,ssl,flags);
            command_end = i+1;
        }else if(c=="\\arctan"){
            let i = this.parse_trigonometric_command(c,f_remain,stack,ssl,flags);
            command_end = i+1;
        }else if(c==="\\pi"){
            let temp = this.parse_char(c,formula,stack,ssl,flags);
            return this.parse_latex_formula(temp[0],temp[1],temp[2]);
        }else if(c==="\\sim"){
            ssl.push(c);
            let node = new NodeSim();
            while(stack.length!==1){
                stack.pop();
            }
            if(stack[0].node.length!==1){
                throw new Error(`范围节点遇到特殊情况`);
            }else{
                node.node.push(stack[0].node[0]);
                stack[0].node = [node];
                stack[0].simflag = true;
                stack.push(node);
            }
            command_end = 0;
        }else{
            throw new Error(`没有处理该指令的代码：${c}`);
        }
        return [f_remain.slice(command_end),stack,ssl];
    }
    parse_char(c,formula,stack,ssl,flags=0){
        //console.log(c);
        if (stack[stack.length - 1].constructor.name !== "NodeMul") {
            let mul = new NodeMul();
            if (flags & SUB_FLAG) {
                mul.sub_flag *= -1;
            }
            stack[stack.length - 1].add_node(mul);
            stack.push(mul);
        } else {
            if (ssl[ssl.length - 1]!=="\\times") {
                ssl.push("\\times");
            }
            if (flags & SUB_FLAG) {
                stack[stack.length - 1].sub_flag *= -1;
            }
        }
        const reg_sup = /\^\{([^\}\' ]+)\}|\^([^\{\' ]+)/;
        let sup = "";
        let ssup = "";
        let base = c;
        if(reg_sup.test(c)){
            const ne = new NodeExp();
            sup = c.match(reg_sup);
            base = c.slice(0,-sup[0].length);
            if(sup[1]==undefined){
                ssup = sup[2];
            }else{
                ssup = sup[1];
            }
            //console.log(base);
            //console.log(ssup);
            try{
                if(!isNaN(base)){
                    ne.add_node(new NodeNum(parseFloat(base)));
                    ssl.push(base);
                }else{
                    ne.add_node(this.get_ls(base));
                    ssl.push(this.get_ls(base));
                }
                ssl.push("^");
                if(!isNaN(ssup)){
                    ne.add_node(new NodeNum(parseFloat(ssup)));
                    ssl.push(ssup);
                }else{
                    ne.add_node(this.get_ls(ssup));
                    ssl.push(this.get_ls(ssup));
                }
                stack[stack.length-1].add_node(ne);
            }catch(e){
                if(!isNaN(c)){
                    stack[stack.length-1].add_node(new NodeNum(parseFloat(c)));
                    ssl.push(c);
                }else{
                    stack[stack.length-1].add_node(this.get_ls(c));
                    ssl.push(this.get_ls(c));
                }
            }
            
        }else{
            if(!isNaN(c)){
                stack[stack.length-1].add_node(new NodeNum(parseFloat(c)));
                ssl.push(c);
            }else{
                stack[stack.length-1].add_node(this.get_ls(c));
                ssl.push(this.get_ls(c));
            }
        }
        //console.log(stack);
        return [formula.slice(c.length),stack,ssl];
    }
    get_value(){
        this.value = this.main_node.get_value();
        return this.value;
    }
    latex_update(){
        this.before_update();
        this.value = this.main_node.get_value();
        this.after_update();
        this.ele.textContent = "".concat("$$",
            this.ls," ",this.connector," ",this.formula,
            "=",this.list_to_string(this.num_substitution_list),
            "=",DesignData.setting_DP(this.value),this.unit,
            this.list_to_string(this.addition_latex_list),"$$");
        return this.value;
    }
    list_to_string(li){
        let temp = [];
        let i = undefined;
        for(i of li){
            if((typeof i)!=="string"){
                if(i.value>=0){
                    temp.push(DesignData.setting_DP(i.value));
                }
                else{
                    temp.push("(");
                    temp.push(DesignData.setting_DP(i.value));
                    temp.push(")");
                }
                if(i.unit=="°"){
                    temp.push("°");
                }
            }else{
                temp.push(i);
            }
        }
        return temp.join("");
    }
    attach_parents_children(){
        let i=undefined;
        for(i of this.num_substitution_list){
            if((typeof i)!=="string"){
                i.children.push(this);
                this.parents.push(i);
            }
        }
    }
    // deattach_parents_children(){
    //     let i=undefined;
    //     for(i of this.num_substitution_list){
    //         if((typeof i)!=="string"){
    //             i.children.filter(item => item !== this);
    //         }
    //     }
    //     this.parents = [];
    // }
}
class DataCompare extends DesignData{
    constructor(id, design_data, formula, comparer="<", com_num=0, ele_update_flag=true) {
        super(id, design_data);
        this.ele_update_flag = ele_update_flag;
        this.formula = formula;
        this.dataformula = new DataFormula("","","=",formula);
        this.comparer = comparer;
        this.la_comparer = comparer;
        this.com_num = com_num;
        this.attach_parents_children();
    }
    get_value(){
        var com_num;
        var value = this.dataformula.get_value();
        if(!isNaN(this.com_num)){
            com_num = this.com_num;
        }else{
            com_num = this.com_num.value;
        }
        if(this.comparer=="<"){
            if(value < com_num){
                this.value = true;
                this.la_comparer = "<";
            }else{
                this.value = false;
                this.la_comparer = " \\ge ";
            }
        }else if(this.comparer==">"){
            if(value > com_num){
                this.value = true;
                this.la_comparer = ">";
            }else{
                this.value = false;
                this.la_comparer = " \\le ";
            }
        }else{
            throw new Error(`无法处理实例${this.id}的比较符号${this.comparer}`);
        }
    }
    latex_update(){
        this.get_value();
        if(this.ele_update_flag){
            this.ele.textContent = " ".concat("$",
                this.formula,this.la_comparer,this.com_num.ls,
                "$");
        }
        return this.value;
    }
    attach_parents_children(){
        let i=undefined;
        for(i of this.dataformula.parents){
            if((typeof i)!=="string"){
                i.children.filter(item => item !== this.dataformula);
                this.parents.push(i);
                i.children.push(this);
            }
        }
        this.dataformula.parents = [];
        if(isNaN(this.com_num)){
            this.com_num.add_child(this);
        }
    }
}
class DataFormulaSwitch extends DesignData{
    constructor(id, latex_sign, unit="", datacompare, formula_t,formula_f) {
		super(id, latex_sign, 0, unit);
        this.datacompare = datacompare;
        this.formula_t = new DataFormula("","","=",formula_t);
        this.formula_init(this.formula_t);
        this.formula_f = new DataFormula("","","=",formula_f);
        this.formula_init(this.formula_f);
        this.attach_parents_children();
    }
    formula_init(f){
        f.ls = this.ls;
        f.ele = this.ele;
        f.unit = this.unit;
    }
    latex_update(){
        this.datacompare.get_value();
        if(this.datacompare == true || this.datacompare.value == true){
            this.value = this.formula_t.latex_update();
        }else{
            this.value = this.formula_f.latex_update();
        }
    }
    attach_parents_children(){
        let i=undefined;
        for(i of this.formula_f.parents){
            if((typeof i)!=="string"){
                i.children.filter(item => item !== this.formula_f);
                this.parents.push(i);
                i.children.push(this);
            }
        }
        for(i of this.formula_t.parents){
            if((typeof i)!=="string"){
                i.children.filter(item => item !== this.formula_t);
                this.parents.push(i);
                i.children.push(this);
            }
        }
        this.formula_f.parents = [];
        this.formula_t.parents = [];
    }
}


