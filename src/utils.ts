export function getSingleQueryParam(value: string | string[] | undefined) {
    const valueStr = Array.isArray(value) ? value[0] : value

    return valueStr
}
