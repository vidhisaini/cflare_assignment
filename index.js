addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

class ElementHandler {
  element(element) {
    if(element.tagName=='title'){
      
      element.prepend("Cloudflare Assignment");
    }
    else if(element.getAttribute('id')=='title'){
      element.prepend("Cloudflare Assignment");
    }
    else if(element.getAttribute('id')=='description'){
      element.prepend("Cloudflare Assignment for Full Stack, ")
    }
    else if(element.getAttribute('id')=='url'){
      element.setAttribute('href','https://github.com/vidhisaini');
      element.setInnerContent("Vidhi's Github Profile");
    }
  }
  
}
async function handleRequest(request) {
   
  var urls={};
   await fetch('https://cfw-takehome.developers.workers.dev/api/variants').then((response)=>{
      return response.json();
   }).then((data)=>{
      urls=data;
   });
   
   var flag=false;
   var cookie=request.headers.get('Cookie');

   var randomNumber;
   var url='url';
   if (cookie && cookie.includes(`${url}=0`)) {
    randomNumber=0;
   } 
   else if (cookie && cookie.includes(`${url}=1`)) {
    randomNumber=1;
   } 
   else {
    randomNumber=Math.floor(Math.random()*2);
    flag = true
   }
    

    var newRequest=new Request(urls['variants'][randomNumber],{
      method:request.method,
      headers:request.headers
    });
    
    var res=await fetch(newRequest);
    if(flag){

      var newHeaders = new Headers(res.headers);
      newHeaders.append('Set-Cookie',`${url}=${randomNumber}`);
      res=new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: newHeaders
      });
    }
   return new HTMLRewriter().on('title', new ElementHandler()).on('h1#title', new ElementHandler())
   .on('p#description', new ElementHandler()).on('a#url', new ElementHandler()).transform(res);
  
}
