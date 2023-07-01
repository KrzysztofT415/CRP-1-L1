import { resolve } from 'path'

const { readFile } = require('fs/promises')
const myPrompt = require('prompt')
const bigints = require('node-math-bigint')

const myPowMod = (base, exp, mod) => BigInt('0x' + bigints.bigInt2str(bigints.powMod(bigints.str2bigInt(base.toString(10), 10), bigints.str2bigInt(exp.toString(10), 10), bigints.str2bigInt(mod.toString(10), 10)), 16))

myPrompt.start()

const readArgsFromFile = async (args: Array<string>, algorithm: Function): Promise<BigInt> => {
    let properties = [
        {
            name: 'file',
            description: 'Enter x and file name',
            type: 'string',
            required: true
        }
    ]
    const { file } = await myPrompt.get(properties)
    let x = file.split(' ')[0]
    let fileName = file.split(' ')[1]

    const data = await readFile(fileName)
    let content = JSON.parse(data)

    return algorithm(
        ...args.map((val: string) => {
            if (val == 'x') return x
            return BigInt('0x' + Buffer.from(content[val].replace(/_/g, '/').replace(/-/g, '+'), 'base64').toString('hex'))
        })
    )
}

const readArgsShort = async (args: Array<string>, algorithm: Function): Promise<BigInt> => {
    let properties = [
        {
            name: 'args_string',
            description: 'Enter args with space between',
            type: 'string',
            required: true
        }
    ]
    const { args_string } = await myPrompt.get(properties)
    return algorithm(...args_string.split(' '))
}

const readArgs = async (args: Array<string>, algorithm: Function): Promise<BigInt> => {
    let properties = args.map(val => {
        return {
            name: val,
            description: 'Enter ' + val,
            pattern: '/^\d+$/', // prettier-ignore
            warning: 'Must be a number',
            type: 'number',
            required: true
        }
    })

    const result = await myPrompt.get(properties)
    return algorithm(...args.map((val: string) => result[val]))
}

const RSA = (x: number, n: number, e: number): BigInt => myPowMod(x, e, n)
const RSA_CRT = (x: number, p: number, q: number, dp: number, dq: number, qi: number): BigInt => {
    let yp = myPowMod(x, dp, p)
    let yq = myPowMod(x, dq, q)
    let h = (BigInt(qi) * (yp - yq)) % BigInt(p)
    if (h < 0) h += BigInt(p)
    return yq + h * BigInt(q)
}

const executeProgram = (type: string): [Function, Array<string>, boolean, boolean] => {
    if (type[0] == 's') return [RSA, ['x', 'n', 'e'], type.length === 1, type === 'sf']
    if (type[0] == 'c') return [RSA_CRT, ['x', 'p', 'q', 'dp', 'dq', 'qi'], type.length === 1, type === 'cf']
    throw 'VOID'
}

const properties = [
    {
        name: 'type',
        description: 'Enter type',
        validator: '/(standard)|(chinese)|s|c|(ch)|(sf)|(cf)/',
        warning: 'Use either standard[s] or chinese[c] rsa algorithm from file [+f]',
        type: 'string',
        required: true
    }
]
myPrompt.get(properties, async (err, res) => {
    if (err) throw err

    let [algorithm, args, short, file] = executeProgram(res.type)
    let rsa: BigInt

    if (file) rsa = await readArgsFromFile(args, algorithm)
    else if (short) rsa = await readArgsShort(args, algorithm)
    else rsa = await readArgs(args, algorithm)

    process.stdout.write(rsa.toString() + '\n')
})
