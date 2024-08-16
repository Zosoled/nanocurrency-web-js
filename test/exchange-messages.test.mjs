// SPDX-FileCopyrightText: 2024 Chris Duncan <chris@zoso.dev>
// SPDX-License-Identifier: GPL-3.0-or-later

'use strict'

import { describe, it, before } from 'node:test'
import { wallet, box } from '../dist/index.js'

describe('Box tests', () => {

	before(async function() {
		this.message = 'The quick brown fox jumps over the lazy dog 🔥'
		this.bob = await wallet.generate()
		this.alice = await wallet.generateLegacy()
	})

	it('should encrypt and decrypt a message from bob to alice', async function() {
		const encrypted = await box.encrypt(this.message, this.alice.accounts[0].address, this.bob.accounts[0].privateKey)
		const encrypted2 = await box.encrypt(this.message, this.alice.accounts[0].address, this.bob.accounts[0].privateKey)
		const encrypted3 = await box.encrypt(this.message + 'asd', this.alice.accounts[0].address, this.bob.accounts[0].privateKey)

		// Just to be safe
		expect(this.message).to.not.equal(encrypted)
		expect(encrypted).to.not.equal(encrypted2)
		expect(encrypted).to.not.equal(encrypted3)

		const decrypted = box.decrypt(encrypted, this.bob.accounts[0].address, this.alice.accounts[0].privateKey)
		expect(this.message).to.equal(decrypted)
	})

	it('should encrypt and decrypt a message from alice to bob', async function() {
		const encrypted = await box.encrypt(this.message, this.bob.accounts[0].address, this.alice.accounts[0].privateKey)
		const decrypted = box.decrypt(encrypted, this.alice.accounts[0].address, this.bob.accounts[0].privateKey)
		expect(this.message).to.equal(decrypted)
	})

	it('should fail to decrypt with wrong public key in encryption', async function() {
		// Encrypt with wrong public key
		const aliceAccounts = await wallet.legacyAccounts(this.alice.seed, 1, 2)
		const encrypted = await box.encrypt(this.message, aliceAccounts[0].address, this.bob.accounts[0].privateKey)
		expect(() => box.decrypt(encrypted, this.bob.accounts[0].address, this.alice.accounts[0].privateKey)).to.throw()
	})

	it('should fail to decrypt with wrong public key in decryption', async function() {
		// Decrypt with wrong public key
		const bobAccounts = await wallet.accounts(this.bob.seed, 1, 2)
		const encrypted = await box.encrypt(this.message, this.alice.accounts[0].address, this.bob.accounts[0].privateKey)
		expect(() => box.decrypt(encrypted, bobAccounts[0].address, this.alice.accounts[0].privateKey)).to.throw()
	})

	it('should fail to decrypt with wrong private key in encryption', async function() {
		// Encrypt with wrong public key
		const bobAccounts = await wallet.accounts(this.bob.seed, 1, 2)
		const encrypted = await box.encrypt(this.message, this.alice.accounts[0].address, bobAccounts[0].privateKey)
		expect(() => box.decrypt(encrypted, this.bob.accounts[0].address, this.alice.accounts[0].privateKey)).to.throw()
	})

	it('should fail to decrypt with wrong private key in decryption', async function() {
		// Encrypt with wrong public key
		const aliceAccounts = await wallet.legacyAccounts(this.alice.seed, 1, 2)
		const encrypted = await box.encrypt(this.message, this.alice.accounts[0].address, this.bob.accounts[0].privateKey)
		expect(() => box.decrypt(encrypted, this.bob.accounts[0].address, aliceAccounts[0].privateKey)).to.throw()
	})

})