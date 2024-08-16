// SPDX-FileCopyrightText: 2024 Chris Duncan <chris@zoso.dev>
// SPDX-License-Identifier: GPL-3.0-or-later

'use strict'

import { describe, it, before } from 'node:test'
import { strict as assert } from 'assert'
import { wallet, block, tools } from '../dist/index.js'

describe('unit conversion tests', () => {

	it('should convert nano to raw', () => {
		const result = tools.convert('1', 'NANO', 'RAW')
		expect(result).to.equal('1000000000000000000000000000000')
	})

	it('should convert raw to nano', () => {
		const result = tools.convert('1000000000000000000000000000000', 'RAW', 'NANO')
		expect(result).to.equal('1.000000000000000000000000000000')
	})

})

describe('Signer tests', () => {

	before(async function() {
		this.testWallet = await wallet.generate()
	})

	// Private key: 3be4fc2ef3f3b7374e6fc4fb6e7bb153f8a2998b3b3dab50853eabe128024143
	// Public key: 5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4

	it('should sign data with a single parameter', () => {
		const result = tools.sign('3be4fc2ef3f3b7374e6fc4fb6e7bb153f8a2998b3b3dab50853eabe128024143', 'miro@metsanheimo.fi')
		expect(result).to.equal('fecb9b084065adc969904b55a0099c63746b68df41fecb713244d387eed83a80b9d4907278c5ebc0998a5fc8ba597fbaaabbfce0abd2ca2212acfe788637040c')
	})

	it('should sign data with multiple parameters', () => {
		const result = tools.sign('3be4fc2ef3f3b7374e6fc4fb6e7bb153f8a2998b3b3dab50853eabe128024143', 'miro@metsanheimo.fi', 'somePassword')
		expect(result).to.equal('bb534f9b469af451b1941ffef8ee461fc5d284b5d393140900c6e13a65ef08d0ae2bc77131ee182922f66c250c7237a83878160457d5c39a70e55f7fce925804')
	})

	it('should verify a signature using the public key', () => {
		const result = tools.verify('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4', 'fecb9b084065adc969904b55a0099c63746b68df41fecb713244d387eed83a80b9d4907278c5ebc0998a5fc8ba597fbaaabbfce0abd2ca2212acfe788637040c', 'miro@metsanheimo.fi')
		expect(result).to.be.true

		const result2 = tools.verify('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4', 'fecb9b084065adc969904b55a0099c63746b68df41fecb713244d387eed83a80b9d4907278c5ebc0998a5fc8ba597fbaaabbfce0abd2ca2212acfe788637040c', 'mir@metsanheimo.fi')
		expect(result2).to.be.false

		const result3 = tools.verify('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4', 'aecb9b084065adc969904b55a0099c63746b68df41fecb713244d387eed83a80b9d4907278c5ebc0998a5fc8ba597fbaaabbfce0abd2ca2212acfe788637040c', 'miro@metsanheimo.fi')
		expect(result3).to.be.false
	})

	it('should verify a block using the public key', function() {
		const sendBlock = block.send({
			walletBalanceRaw: '5618869000000000000000000000000',
			fromAddress: this.testWallet.accounts[0].address,
			toAddress: 'nano_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p',
			representativeAddress: 'nano_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou',
			frontier: '92BA74A7D6DC7557F3EDA95ADC6341D51AC777A0A6FF0688A5C492AB2B2CB40D',
			amountRaw: '2000000000000000000000000000000',
		}, this.testWallet.accounts[0].privateKey)

		const publicKey = tools.addressToPublicKey(this.testWallet.accounts[0].address)

		const valid = tools.verifyBlock(publicKey, sendBlock)
		expect(valid).to.be.true

		sendBlock.account = 'nano_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p'
		const valid2 = tools.verifyBlock(this.testWallet.accounts[0].publicKey, sendBlock)
		expect(valid2).to.be.false
	})

	it('should convert a Nano address to public key', () => {
		const publicKey = tools.addressToPublicKey('nano_1pu7p5n3ghq1i1p4rhmek41f5add1uh34xpb94nkbxe8g4a6x1p69emk8y1d')
		expect(publicKey).to.equal('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4')
	})

	it('should convert a public key to a Nano address', () => {
		const address = tools.publicKeyToAddress('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4')
		expect(address).to.equal('nano_1pu7p5n3ghq1i1p4rhmek41f5add1uh34xpb94nkbxe8g4a6x1p69emk8y1d')
	})

	it('should create a blake2b hash', () => {
		let hash = tools.blake2b('asd')
		expect(hash).to.equal('f787fbcdd2b4c6f6447921d6f163e8fddfb83d08432430cacaaab1bbedd723fe')

		hash = tools.blake2b(['asd'])
		expect(hash).to.equal('f787fbcdd2b4c6f6447921d6f163e8fddfb83d08432430cacaaab1bbedd723fe')
	})

})
