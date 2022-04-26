const fs = require('fs');
const path = require('path');


let file = fs.readFileSync(process.argv[2]);
let str_buffer = file.toString('hex')
const patches = {
    //0xE442C
    "tick": {
        "search": /41b90100000066c70301014533c088834e0100008a0d........418d413b/,
        "size":30,
        "replace":[
            {
            'offset':29,
            'value':'1d'
            }
        ]
    },
    "guardians": {
        "search": /4a8b14c0440fb7c54d8b14124f8d0c40498b42484a8b5cc8100fb78b58040000/,
        "size":32,
        "replace":[
            {
            'offset':85,
            'value':'eb'
            }
        ]
    },
    "bottomless_clip": {
        "search": /488d1449b950000000498b040c/,
        "size":13,
        "replace":[
            {
            'offset':87,
            'value':'90909090'
            }
        ]
    },
    "bottomless_nades": {
        "search": /2ac3ba00000004/,
        "size":7,
        "replace":[
            {
            'offset':0,
            'value':'9090'
            }
        ]
    },
    "soft_ceilings": {
        "search": /4863903c02000085d2/,
        "size":8,
        "replace":[
            {
                'offset':9,
                'value':'eb'
            }
        ]
    },
    "triggers": {
        "search": /8be941bed0000000448b838c0400004585c0/,
        "size":18,
        "replace":[
            {
                'offset':18,
                'value':'eb'
            },
            {
                'offset':139,
                'value':'eb'
            }
        ]
    },
}

function match(patch){
    const match = patch.search.exec(str_buffer);
    if(match.index == -1){
        return false;
    }
    let s = Buffer.from(str_buffer.slice(match.index, match.index + (patch.size*2)), 'hex');
    let x = file.indexOf(s)
    patch.replace.forEach(function(e){
        file.write(e.value,x+e.offset,'hex')
    })
    
}

Object.keys(patches).forEach(key => {
    if(match(patches[key]) == false){
        console.log(key + ' not found so it was not patched');
    }
});

fs.writeFileSync(`./patched/halo3.dll`,file)