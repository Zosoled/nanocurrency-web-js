// SPDX-FileCopyrightText: 2024 Chris Duncan <chris@zoso.dev>
// SPDX-License-Identifier: GPL-3.0-or-later

'use strict'

import { describe, it } from 'node:test'
import { block } from '../dist/index.js'

// WARNING: Do not send any funds to the test vectors below
// Test vectors from https://docs.nano.org/integration-guides/key-management/
describe('block signing tests using official test vectors', () => {

	it('should create a valid signature for a receive block', () => {
		const work = 'c5cf86de24b24419'
		const result = block.receive({
			walletBalanceRaw: '18618869000000000000000000000000',
			transactionHash: 'CBC911F57B6827649423C92C88C0C56637A4274FF019E77E24D61D12B5338783',
			toAddress: 'nano_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx',
			representativeAddress: 'nano_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou',
			frontier: '92BA74A7D6DC7557F3EDA95ADC6341D51AC777A0A6FF0688A5C492AB2B2CB40D',
			amountRaw: '7000000000000000000000000000000',
			work,
		}, '781186FB9EF17DB6E3D1056550D9FAE5D5BBADA6A6BC370E4CBB938B1DC71DA3')
		expect(result.signature.toUpperCase()).to.equal('F25D751AD0379A5718E08F3773DA6061A9E18842EF5615163C7F207B804CC2C5DD2720CFCE5FE6A78E4CC108DD9CAB65051526403FA2C24A1ED943BB4EA7880B')
		expect(result.work).to.equal(work)
	})

	it('should create a valid signature for a receive block without work', () => {
		const result = block.receive({
			walletBalanceRaw: '18618869000000000000000000000000',
			transactionHash: 'CBC911F57B6827649423C92C88C0C56637A4274FF019E77E24D61D12B5338783',
			toAddress: 'nano_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx',
			representativeAddress: 'nano_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou',
			frontier: '92BA74A7D6DC7557F3EDA95ADC6341D51AC777A0A6FF0688A5C492AB2B2CB40D',
			amountRaw: '7000000000000000000000000000000',
		}, '781186FB9EF17DB6E3D1056550D9FAE5D5BBADA6A6BC370E4CBB938B1DC71DA3')
		expect(result.signature.toUpperCase()).to.equal('F25D751AD0379A5718E08F3773DA6061A9E18842EF5615163C7F207B804CC2C5DD2720CFCE5FE6A78E4CC108DD9CAB65051526403FA2C24A1ED943BB4EA7880B')
		expect(result.work).to.equal('')
	})

	it('should create a valid signature for a send block', () => {
		const work = 'fbffed7c73b61367'
		const result = block.send({
			walletBalanceRaw: '5618869000000000000000000000000',
			fromAddress: 'nano_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx',
			toAddress: 'nano_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p',
			representativeAddress: 'nano_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou',
			frontier: '92BA74A7D6DC7557F3EDA95ADC6341D51AC777A0A6FF0688A5C492AB2B2CB40D',
			amountRaw: '2000000000000000000000000000000',
			work,
		}, '781186FB9EF17DB6E3D1056550D9FAE5D5BBADA6A6BC370E4CBB938B1DC71DA3')
		expect(result.signature.toUpperCase()).to.equal('79240D56231EF1885F354473733AF158DC6DA50E53836179565A20C0BE89D473ED3FF8CD11545FF0ED162A0B2C4626FD6BF84518568F8BB965A4884C7C32C205')
		expect(result.work).to.equal(work)
	})

	it('should create a valid signature for a send block without work', () => {
		const result = block.send({
			walletBalanceRaw: '5618869000000000000000000000000',
			fromAddress: 'nano_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx',
			toAddress: 'nano_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p',
			representativeAddress: 'nano_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou',
			frontier: '92BA74A7D6DC7557F3EDA95ADC6341D51AC777A0A6FF0688A5C492AB2B2CB40D',
			amountRaw: '2000000000000000000000000000000',
		}, '781186FB9EF17DB6E3D1056550D9FAE5D5BBADA6A6BC370E4CBB938B1DC71DA3')
		expect(result.signature.toUpperCase()).to.equal('79240D56231EF1885F354473733AF158DC6DA50E53836179565A20C0BE89D473ED3FF8CD11545FF0ED162A0B2C4626FD6BF84518568F8BB965A4884C7C32C205')
		expect(result.work).to.equal('')
	})

	it('should create a valid signature for a change rep block', () => {
		const work = '0000000000000000'
		const result = block.representative({
			walletBalanceRaw: '3000000000000000000000000000000',
			address: 'nano_3igf8hd4sjshoibbbkeitmgkp1o6ug4xads43j6e4gqkj5xk5o83j8ja9php',
			representativeAddress: 'nano_1anrzcuwe64rwxzcco8dkhpyxpi8kd7zsjc1oeimpc3ppca4mrjtwnqposrs',
			frontier: '128106287002E595F479ACD615C818117FCB3860EC112670557A2467386249D4',
			work,
		}, '781186FB9EF17DB6E3D1056550D9FAE5D5BBADA6A6BC370E4CBB938B1DC71DA3') // Did not find a private key at nano docs for this address
		expect(result.signature.toUpperCase()).to.equal('A3C3C66D6519CBC0A198E56855942DEACC6EF741021A1B11279269ADC587DE1DA53CD478B8A47553231104CF24D742E1BB852B0546B87038C19BAE20F9082B0D')
		expect(result.work).to.equal(work)
	})

	it('should create a valid signature for a change rep block without work', () => {
		const result = block.representative({
			walletBalanceRaw: '3000000000000000000000000000000',
			address: 'nano_3igf8hd4sjshoibbbkeitmgkp1o6ug4xads43j6e4gqkj5xk5o83j8ja9php',
			representativeAddress: 'nano_1anrzcuwe64rwxzcco8dkhpyxpi8kd7zsjc1oeimpc3ppca4mrjtwnqposrs',
			frontier: '128106287002E595F479ACD615C818117FCB3860EC112670557A2467386249D4',
		}, '781186FB9EF17DB6E3D1056550D9FAE5D5BBADA6A6BC370E4CBB938B1DC71DA3') // Did not find a private key at nano docs for this address
		expect(result.signature.toUpperCase()).to.equal('A3C3C66D6519CBC0A198E56855942DEACC6EF741021A1B11279269ADC587DE1DA53CD478B8A47553231104CF24D742E1BB852B0546B87038C19BAE20F9082B0D')
		expect(result.work).to.equal('')
	})

})