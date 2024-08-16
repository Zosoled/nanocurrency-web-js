// SPDX-FileCopyrightText: 2024 Chris Duncan <chris@zoso.dev>
// SPDX-License-Identifier: GPL-3.0-or-later

'use strict'

import { describe, it } from 'node:test'
import { strict as assert } from 'assert'
import { wallet } from '../dist/index.js'

// WARNING: Do not send any funds to the test vectors below
// Test vectors from https://docs.nano.org/integration-guides/key-management/ and elsewhere
describe('generate wallet test', async () => {

	it('should generate wallet with random entropy', async () => {
		const result = await wallet.generate()
		assert(Object.getOwnPropertyNames(result).some(p => p === 'mnemonic'))
		assert(Object.getOwnPropertyNames(result).some(p => p === 'seed'))
		assert(Object.getOwnPropertyNames(result).some(p => p === 'accounts'))
	})

	it('should generate the correct wallet with the given test vector', async () => {
		const result = await wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c7970')
		assert(Object.getOwnPropertyNames(result).some(p => p === 'mnemonic'))
		assert(Object.getOwnPropertyNames(result).some(p => p === 'seed'))
		assert(Object.getOwnPropertyNames(result).some(p => p === 'accounts'))
		assert.strictEqual(result.mnemonic, 'hole kiss mouse jacket also board click series citizen slight kite smoke desk diary rent mercy inflict antique edge invite slush athlete total brain')
		assert.strictEqual(result.seed, '1accdd4c25e06e47310d0c62c290ec166071d024352e003e5366e8ba6ba523f2a0cb34116ac55a238a886778880a9b2a547112fd7cffade81d8d8d084ccb7d36')
		assert.strictEqual(result.accounts[0].privateKey, 'eb18b748bcc48f824cf8a1fe92f7fc93bfc6f2a1eb9c1d40fa26d335d8a0c30f')
		assert.strictEqual(result.accounts[0].publicKey, 'a9ef7bbc004813cf75c5fc5c582066182d5c9cffd42eb7eb81cefea8e78c47c5')
		assert.strictEqual(result.accounts[0].address, 'nano_3chhhgy11k1msxtwdz4wd1i8e83fdkghzo3gpzor5mqyo5mrrjy79zpw1g34')
	})

	it('should generate the correct wallet with the given test vector and a seed password', async () => {
		const result = await wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c7970', 'some password')

		assert(Object.getOwnPropertyNames(result).some(p => p === 'mnemonic'))
		assert(Object.getOwnPropertyNames(result).some(p => p === 'seed'))
		assert(Object.getOwnPropertyNames(result).some(p => p === 'accounts'))

		assert.strictEqual(result.mnemonic, 'hole kiss mouse jacket also board click series citizen slight kite smoke desk diary rent mercy inflict antique edge invite slush athlete total brain')
		assert.notStrictEqual(result.seed, '1accdd4c25e06e47310d0c62c290ec166071d024352e003e5366e8ba6ba523f2a0cb34116ac55a238a886778880a9b2a547112fd7cffade81d8d8d084ccb7d36')
		assert.notStrictEqual(result.accounts[0].privateKey, 'eb18b748bcc48f824cf8a1fe92f7fc93bfc6f2a1eb9c1d40fa26d335d8a0c30f')
		assert.notStrictEqual(result.accounts[0].publicKey, 'a9ef7bbc004813cf75c5fc5c582066182d5c9cffd42eb7eb81cefea8e78c47c5')
		assert.notStrictEqual(result.accounts[0].address, 'nano_3chhhgy11k1msxtwdz4wd1i8e83fdkghzo3gpzor5mqyo5mrrjy79zpw1g34')

		assert.strictEqual(result.seed, '146e3e2a0530848c9174d45ecec8c3f74a7be3f1ee832f92eb6227284121eb2e48a6b8fc469403984cd5e8f0d1ed05777c78f458d0e98c911841590e5d645dc3')
		assert.strictEqual(result.accounts[0].privateKey, '2d5851bd5a89b8c943078be6ad5bbee8aeab77d6a4744c20d1b87d78e3286b93')
		assert.strictEqual(result.accounts[0].publicKey, '923b6c7e281c1c5529fd2dc848117781216a1753cfd487fc34009f3591e636d7')
		assert.strictEqual(result.accounts[0].address, 'nano_36jufjz4i91wcnnztdgab1aqh1b3fado9mynizy5a16z8payefpqo81zsshc')
	})

	it('should throw when given an entropy with an invalid length', async () => {
		assert.rejects(async () => await wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c797'))
		assert.rejects(async () => await wallet.generate('6caf5a42bb8074314aae20295975ece663be7aad945a73613d193b0cc41c79701'))
	})

	it('should throw when given an entropy containing non-hex characters', async () => {
		assert.rejects(async () => await wallet.generate(this.testEntropy.replaceAll(/./g, 'x')))
	})

})