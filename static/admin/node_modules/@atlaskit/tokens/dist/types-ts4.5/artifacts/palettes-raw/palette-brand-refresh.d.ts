/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::54883f28091f3d25251716094b262928>>
 * @codegenCommand yarn build tokens
 */
type TokenValue = string | number;
type TokenValueOriginal = string | number;
type TokenAttributes = {
    group: string;
    category: string;
};
type Token = {
    value: TokenValue;
    filePath: string;
    isSource: boolean;
    attributes: TokenAttributes;
    original: {
        value: TokenValueOriginal;
        attributes: TokenAttributes;
    };
    name: string;
    path: string[];
};
declare const tokens: Token[];
export default tokens;
