export type PromiseInfo<T extends (...arg: any) => Promise<any>> = T extends (...arg: any) => Promise<infer R> ? R : T
type OutValues = Array<string | number>
type InToValue = string | number | boolean
type InTo = { [k: string]: InToValue }
type IngTo = {
    k: Array<string>,
    v: Array<string | number>
}
type OutTo = [string, OutValues]
type CTREQ<T extends Record<string, {}>> = T & { orderBy?: T }
export type CTTYPE<T extends Record<string, { req: {}, res: {} }>> = {
    Ios: {
        [api in keyof T]: (req: CTREQ<T[api]['req']>) => Promise<T[api]['res']>
    },
    Apis: <
        api extends keyof T,
        req extends CTREQ<T[api]['req']>,
        >(api: api, req: req) => Promise<{
            api: api//[model,api]=api.split('_')
            req: req
            res: T[api]['res']
        }>
}

// export type ApiRes<T extends CT,api extends keyof T> = {
//     api: api//[model,api]=api.split('_')`${}`
//     req: T[api]['req']
//     res: T[api]['res']
// }

// export type CtU2I<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
// export type Api<T extends CT, K extends keyof T = keyof T> =
//     CtU2I<K extends any ? (key: K, req: T[K]['req']) => Promise<ApiRes<T>> : never>

// function objectIsEmpty(object: object = {}) {
//     return !Object.getOwnPropertyNames(object).length && !Object.getOwnPropertySymbols(object).length
// }
export const passwordMath = (len: number): string => {
    const s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //prompt("请输入密码的长度");
    let pass = "";
    for (let i = 0; i < len; i++) {
        const b = Math.random() * 62;
        const c = Math.floor(b);
        pass += s[c];
    }
    return pass
}
export const nxdatetime = () => {
    const date = new Date();
    let month: string | number = date.getMonth() + 1;
    let strDate: string | number = date.getDate();
    if (month <= 9) {
        month = "0" + month;
    }
    if (strDate <= 9) {
        strDate = "0" + strDate;
    }
    return date.getFullYear() + "-" + month + "-" + strDate + " "
        + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}
export const binSet: <T extends string>(tname: T, setObj: InTo) => OutTo = (tname, setObj) => {
    let kv: IngTo = { k: [], v: [] }
    setObj = { ...setObj, uptimestamp: nxdatetime() }
    Object.entries(setObj).forEach(([k, v]) => {
        if (v === null) {
            kv.k.push(`${tname}.${k}=null`)
        } else if (v === false || v === undefined) {
            kv.k.push(`${tname}.${k}=0`)
        } else if (v === true) {
            kv.k.push(`${tname}.${k}=1`)
        } else {
            kv.k.push(`${tname}.${k}=?`)
            kv.v.push(v)
        }
    })
    return [kv.k.join(' , '), kv.v]
}
export const binWhere: <TableName extends string>(op: { [k in TableName]: InTo }) => OutTo = (op) => {
    let kv: IngTo = { k: [], v: [] }
    Object.entries(op).forEach(([tname, obj]) => {
        Object.entries(obj as InTo).forEach(([k, v]) => {
            if (v === null) {
                kv.k.push(`${tname}.${k} is null`)
            } else if (v === false) {
                kv.k.push(`${tname}.${k}=0`)
            } else if (v === true) {
                kv.k.push(`${tname}.${k}=1`)
            } else {
                kv.k.push(`${tname}.${k}=?`)
                kv.v.push(v)
            }
        })
    })
    const wherek = kv.k.length ? ' where ' + kv.k.join(' and ') : ''
    return [wherek, kv.v]
}
export const binOrderby: <TableName extends string>(op?: { [k in TableName]: InTo }) => string = (op) => {
    if (!op) return ''
    const ret: InToValue[] = []
    Object.entries(op).forEach(([tname, obj]) => Object.entries(obj as InTo).forEach(([k, v]) => {
        ret.push(`${tname}.${k} ${v ? 'desc' : 'asc'}`)
    }))
    return ret.length ? ' ORDER BY ' + ret.join(',') : ''
}

