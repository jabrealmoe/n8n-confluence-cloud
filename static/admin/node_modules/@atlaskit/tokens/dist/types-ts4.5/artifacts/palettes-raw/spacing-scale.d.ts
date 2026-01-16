/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::11e5a7b123691c94315b7df9e7aa8f9f>>
 * @codegenCommand yarn build tokens
 */
type TokenValue = string;
type TokenValueOriginal = number;
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
