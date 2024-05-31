

export const checkImgUrl =  (url:string,resolve:()=>any,reject?:()=>any) => {
    const img = new Image();
    
    img.onload = function() {        
        resolve()
    };
    
    img.onerror = function() {
        reject && reject()
    };
    
    img.src = url;
}