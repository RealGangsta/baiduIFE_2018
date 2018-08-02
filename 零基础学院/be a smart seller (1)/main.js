var region = document.querySelector("#region-select");
var product = document.querySelector("#product-select");
var regionCheckbox = document.querySelector('#region-checkbox-wrapper');
var productCheckbox = document.querySelector('#product-checkbox-wrapper');
var tableWrapper = document.querySelector('#table-wrapper');
region.onchange = selectOnchangeHandler;
product.onchange = selectOnchangeHandler;
regionCheckbox.onclick = function(e){
	e = e || window.event;
	var target = e.target || e.srcElement;
	if(target.nodeName == 'INPUT') 
		selectAllHandler(target, '#region-checkbox-wrapper');
	checkOnclickHandler();
}
productCheckbox.onclick = function(e){
	e = e || window.event;
	var target = e.target || e.srcElement;
	if(target.nodeName == 'INPUT') 
		selectAllHandler(target, '#product-checkbox-wrapper');
	checkOnclickHandler();
}
function selectAllHandler(t, box){
	var all = document.querySelectorAll(box+' input');
	if(t.name == 'all'){
		if(!t.checked){
			t.checked = false;
			for(var i=0; i<all.length-1; i++){
				all[i].checked = false;
			}
		}else{
			t.setAttribute('checked', true);
			for(var i=0; i<all.length-1; i++){
				all[i].checked = true;
			}
		}
	}else{
		if(t.checked){
			var count = 0;
			t.checked = true;
			for(var i=0;i<all.length-1; i++){
				if(all[i].checked) count++;
			}
			if(count == 3)
				all[all.length-1].checked = true;
		}else{
			var count = 0;
			t.checked = false;
			if(all[all.length-1].checked) all[all.length-1].checked = false;
			for(var i=0; i<all.length-1; i++){
				if(all[i].checked) count++;
			}
			if(count == 0) t.checked = true;
		}
	}
}
function selectOnchangeHandler(){
	var regionIndex = region.selectedIndex;
    var regionSelected = region.options[regionIndex].value;
    var productIndex = product.selectedIndex;
    var productSelected = product.options[productIndex].value;
    genForm(getDataFromSource(['region','product'], regionSelected, productSelected));
}
function checkOnclickHandler(){
	var region = document.querySelectorAll('#region-checkbox-wrapper input');
	var product = document.querySelectorAll('#product-checkbox-wrapper input');
	var regioncount = 0;
	var productcount = 0;
	var data = [];
	for(var i=0; i<region.length-1; i++){
		if(region[i].checked){
			regioncount+=1;
			for(var j=0; j<product.length-1; j++){
				if(product[j].checked){
					productcount+=1;
					var arr = getDataFromSource(['region','product'], region[i].value, product[j].value);
					data.push(arr);
				}
			}
		}
	}
	if(regioncount == 1 && productcount == 1)
		genForm(data[0]);
	else if(regioncount == 1 && productcount>1){
		genForm(0,data,'r');
	}else{
		data.sort((a,b) => (a[0].product > b[0].product));
		genForm(0,data,0,regioncount);
	}
}
function isArray(value){
	if (typeof Array.isArray === "function") {
        return Array.isArray(value);
    }else{
        return Object.prototype.toString.call(value) === "[object Array]";
    }
}
function getDataFromSource(kind, s, r){
	var arr = [];
	for(var i of sourceData){
		if(i[kind[0]] == s && i[kind[1]] == r){
			arr.push(i);
		}
	}
	return arr;
}
function getTrofData(arr){
	var a = []
	for(var i in arr){
		if(isArray(arr[i])){
			for(j of arr[i])
				a.push(j);
		}else
		    a.push(arr[i]);
	}
	return a;
}
function genNode(nodename, innertext){
	var node = document.createElement(nodename);
	if(innertext) node.innerText = innertext;
	return node;
}
function genFormHead(headcol){
	var tr = genNode('tr');
	var th1 = genNode('th','商品');
	var th2 = genNode('th','地区');
	if(headcol == 'r'){
		tr.appendChild(th2);
		tr.appendChild(th1);
	}else{
		tr.appendChild(th1);
		tr.appendChild(th2);
	}
	for(var i=1; i<13; i++){
		let th = genNode('th',i+'月');
		tr.appendChild(th);
	}
	return tr;
}
function genForm(arr, data, headcol, row){
	tableWrapper.innerText = '';
	var table = genNode('table');
	var head = genFormHead(headcol);
	table.appendChild(head);
	if(arr){
		for(var i of arr){
			var tmparr = getTrofData(i);
			var tr = genNode('tr');
			for(var j=0; j<tmparr.length; j++){
				var td = genNode('td',tmparr[j]);
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
	}else{
		if(headcol == 'r'){
			for(var x of data){
				for(var y of x){
					var tmparr = getTrofData(y);
					var tr = genNode('tr');
					var tmp = tmparr[0];
					tmparr[0] = tmparr[1];
					tmparr[1] = tmp;
					for(var z=0; z<tmparr.length; z++){
						var td = genNode('td',tmparr[z]);
						tr.appendChild(td);
					}
					table.appendChild(tr);
				}
			}
		}else{
			for(var y=0; y<data.length; y++){
				var tmparr = getTrofData(data[y][0]);
				var tr = genNode('tr');
				if(y%row == 0){
					for(var z=0; z<tmparr.length; z++){
						var td = genNode('td',tmparr[z]);
						if(z==0) td.setAttribute('rowspan', row);
						tr.appendChild(td);
					}
				}else{
					for(var z=1; z<tmparr.length; z++){
						var td = genNode('td',tmparr[z]);
						tr.appendChild(td);
					}
				}
				table.appendChild(tr);
			}
		}
	}
	table.setAttribute('border',1);
	tableWrapper.appendChild(table);
}