export function Gettime() {
	let tiemdata={}
	let d=new Date()
	let yearstar=2005
    let yearend=d.getFullYear()+1
    let year=[]
    let month=[]
    let day=[]
    for(var i=yearstar;i<yearend;i++){
    	year.push(String(i))
    }
    for(var j=1;j<13;j++){

    	if(String(j).length>1){
    		month.push(String(j))
    	}else{
    		month.push('0'+j)
    	}

    }
    for(var z=1;z<32;z++){
    	if(String(z).length>1){
    		day.push(String(z))
    	}else{
    		day.push('0'+z)
    	}


    	
    }
    tiemdata.year=year
    tiemdata.month=month
    tiemdata.day=day
    return tiemdata
}