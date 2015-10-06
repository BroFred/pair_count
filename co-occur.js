var modulePair=function(link,callback){
	var child=require('child_process');
	//split filename and cwd
	var cwd=link.split('/');
	var filename=cwd.splice(-1);
	cwd=cwd.join('/');
	//
	var option={'cwd':cwd};
	var hold=[];
	var target;
	function rfile(count,hold,tlen){ //read data to memory
		child.exec("awk \'NR=="+count+"{print $0}\' "+filename,option,function(err,out,errout){
			var outArr,outArr2=[],col,dic={},temp;
			outArr=out.replace(/\n/,'');
			outArr=outArr.split(',');
			while(outArr.length){
				temp=outArr.shift().trim();
				if(!dic[temp]){
					dic[temp]=1;
					outArr2.push(temp);
				}
			}
			outArr2.sort();
			hold.push(outArr2);
		}).on('exit',function(){
			if(hold.length===tlen){
				CreateDic(hold,callback,target); //when complete reading call
			}
			else{
				rfile(++count,hold,tlen);
			}
		});
	}
	child.exec("wc -l "+filename,option,function(err,out,errout){ //count total lines
			var count=parseInt(out);
			child.exec("awk \'NR==1{print $0}\' "+filename,option,function(err,out,errout){
				target=parseInt(out);
				// read string to array
				rfile(2,hold,count);
				//
			});
	});
	function CreateDic(hold,callback,target){
		var row=hold.length;
		var col;
		var dic={}; // factory dictionary {factoryName : index}
		var dic2={}; // factory pair dictionary {pairCode: count}
		var dic3={}; // factory dictionary {index:factoryName}
		var num=1;
		var temp;
		var res=[];
		for(var i=0;i<row;i++){
			col=hold[i].length;
			for(var k=0;k<col;k++){
				if(!dic[hold[i][k]]){
					dic[hold[i][k]]=num;
					dic3[num]=hold[i][k];
					num++;
				}
				hold[i][k]=dic[hold[i][k]];
			}
		}
		for(var i=0;i<row;i++){
			col=hold[i].length;
			for(var k=0;k<col;k++){
				for(var j=k+1;j<col;j++){
					temp=(hold[i][k]+hold[i][j])*parseInt((hold[i][k]+hold[i][j]+1)/2)+hold[i][k]; //generate pairCode use Cantor pairing function:pi(k1, k2) = 1/2(k1 + k2)(k1 + k2 + 1) + k2
					if(dic2[temp]){
						dic2[temp]++;
						if(dic2[temp]===target){
							res.push(dic3[hold[i][k]]+','+dic3[hold[i][j]]);
							dic2[temp]=false;
						}
					}
					else{
						if(dic2[temp]===false){
							continue;
						}
						dic2[temp]=1;
						if(dic2[temp]>=target){
							res.push(dic3[hold[i][k]]+','+dic3[hold[i][j]]);
							dic2[temp]=false;
						}
					}
				}
			}
		}
		//console.log(dic3);
		//console.log(res.join('\n'));
		res.sort();
		callback(res.join('\n')+'\n');
	}
}
var stdinPair=function(callback){
	var hold=[];
	var target;
	var readline = require('readline');
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: null
	});
	var hold=[];
	rl.on('line',function(out){
		var outArr,outArr2=[],col,dic={},temp;
			dic={};
			outArr2=[];
			outArr=out.replace(/\n/,'');
			outArr=outArr.split(',');
			while(outArr.length){
				temp=outArr.shift().trim();
				if(!dic[temp]){
					dic[temp]=1;
					outArr2.push(temp);
				}
			}
			outArr2.sort();
			hold.push(outArr2);
	});
	rl.on('close',function(){
		target=parseInt(hold.shift());
		CreateDic(hold,callback,target);
	});
	function CreateDic(hold,callback,target){
		var row=hold.length;
		var col;
		var dic={}; // factory dictionary {factoryName : index}
		var dic2={}; // factory pair dictionary {pairCode: count}
		var dic3={}; // factory dictionary {index:factoryName}
		var num=1;
		var temp;
		var res=[];
		for(var i=0;i<row;i++){
			col=hold[i].length;
			for(var k=0;k<col;k++){
				if(!dic[hold[i][k]]){
					dic[hold[i][k]]=num;
					dic3[num]=hold[i][k];
					num++;
				}
				hold[i][k]=dic[hold[i][k]];
			}
		}
		for(var i=0;i<row;i++){
			col=hold[i].length;
			for(var k=0;k<col;k++){
				for(var j=k+1;j<col;j++){
					temp=(hold[i][k]+hold[i][j])*parseInt((hold[i][k]+hold[i][j]+1)/2)+hold[i][k]; //generate pairCode use Cantor pairing function:pi(k1, k2) = 1/2(k1 + k2)(k1 + k2 + 1) + k2
					if(dic2[temp]){
						dic2[temp]++;
						if(dic2[temp]===target){
							res.push(dic3[hold[i][k]]+','+dic3[hold[i][j]]);
							dic2[temp]=false;
						}
					}
					else{
						if(dic2[temp]===false){
							continue;
						}
						dic2[temp]=1;
						if(dic2[temp]>=target){
							res.push(dic3[hold[i][k]]+','+dic3[hold[i][j]]);
							dic2[temp]=false;
						}
					}
				}
			}
		}
		//console.log(dic3);
		//console.log(res.join('\n'));
		res.sort();
		callback(res.join('\n')+'\n');
	}
}
exports.modulePair=modulePair;
exports.stdinPair=stdinPair;
