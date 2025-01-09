const _info = {
    schem: "http",
    pureDomain: "localhost",
    port: 8080
}

function getRoot() {
    return `${_info.schem}://${_info.pureDomain}${_info.port?":"+_info.port:""}/`
}

export { getRoot };