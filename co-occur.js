var x=function(link,callback){
	var cwd=link.split('/');
	var filename=cwd.splice(-1);
	cwd=cwd.join('/');
	var child=require('child_process');
	var option={'cwd':cwd};
	var hold=[];
	var target=[];
	var target=2;
	child.exec("wc -l "+filename,option,function(err,out,errout){
			var count=1;
			count=parseInt(out);
			child.exec("awk \'NR==1{print $0}\' "+filename,option,function(err,out,errout){
				target=parseInt(out);
				for(var i=2;i<=count+1;i++){
					(function(count,hold,tlen){
						child.exec("awk \'NR=="+count+"{print $0}\' "+filename,option,function(err,out,errout){
							if(count!==1){
								out=out.replace(/\r\n|\n/,'');
								out=out.split(',');
								hold.push(out.slice(0));
								if(hold.length===tlen){
									CreateDic(hold,callback,target);
								}
							}
							else{
								target[0]=out;
							}
						});
					})(i,hold,count);
				}
			});
	});
	function CreateDic(hold,callback){
		var row=hold.length;
		var col;
		var dic={};
		var dic2={};
		var dic3={};
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
					temp=(hold[i][k]+hold[i][j])*parseInt((hold[i][k]+hold[i][j]+1)/2)+hold[i][k];
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
						if(dic2[temp]===target){
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
		callback(res.join('\n'));
	}
}
exports.x=x;
