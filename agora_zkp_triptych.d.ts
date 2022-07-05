/* tslint:disable */
/* eslint-disable */
/**
* @param {string} msg_hash
* @param {string} privkey
* @param {number} index
* @param {any} ring
* @returns {any}
*/
export function sign(msg_hash: string, privkey: string, index: number, ring: any): any;
/**
* @param {string} msg_hash
* @param {any} proof
* @param {any} ring
* @returns {any}
*/
export function verify(msg_hash: string, proof: any, ring: any): any;
