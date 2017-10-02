
const toLocalTime = timestamp => new Date(timestamp).toLocaleString();

const b64DecodeUnicode = (str) =>     
       decodeURIComponent(window.atob(str).split('').map(c => 
           `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`         
        ).join(''));   

export { toLocalTime, b64DecodeUnicode };
