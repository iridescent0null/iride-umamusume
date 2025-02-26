const _info = {
    schem: "http",
    pureDomain: "localhost", // change it in the public server
    port: 8080
}

function getRoot() {
    return `${_info.schem}://${_info.pureDomain}${_info.port?":"+_info.port:""}/`
}

export { getRoot };