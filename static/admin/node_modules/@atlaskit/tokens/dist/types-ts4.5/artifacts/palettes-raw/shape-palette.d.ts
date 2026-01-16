/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::ef8d19ca8bc8266920cad68bf6df9a2a>>
 * @codegenCommand yarn build tokens
 */
type TokenValue = string;
type TokenValueOriginal = string | number;
type TokenAttributes = {
    group: string;
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
