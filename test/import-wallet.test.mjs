// SPDX-FileCopyrightText: 2024 Chris Duncan <chris@zoso.dev>
// SPDX-License-Identifier: GPL-3.0-or-later

'use strict'

import { describe, it } from 'node:test'
import { wallet } from '../dist/index.js'

// WARNING: Do not send any funds to the test vectors below
// Test vectors from https://docs.nano.org/integration-guides/key-management/ and elsewhere
describe('import wallet with test vectors test', () => {

	it('should successfully import a wallet with the official Nano test vectors mnemonic', async () => {
		const result = await wallet.fromMnemonic(
			'edge defense waste choose enrich upon flee junk siren film clown finish luggage leader kid quick brick print evidence swap drill paddle truly occur',
			'some password')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
		expect(result.mnemonic).to.equal('edge defense waste choose enrich upon flee junk siren film clown finish luggage leader kid quick brick print evidence swap drill paddle truly occur')
		expect(result.seed).to.equal('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')
		expect(result.accounts[0].privateKey).to.equal('3be4fc2ef3f3b7374e6fc4fb6e7bb153f8a2998b3b3dab50853eabe128024143')
		expect(result.accounts[0].publicKey).to.equal('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4')
		expect(result.accounts[0].address).to.equal('nano_1pu7p5n3ghq1i1p4rhmek41f5add1uh34xpb94nkbxe8g4a6x1p69emk8y1d')
	})

	it('should successfully import a wallet with the checksum starting with a zero', () => {
		wallet.fromMnemonic('food define cancel major spoon trash cigar basic aim bless wolf win ability seek paddle bench seed century group they mercy address monkey cake')
	})

	it('should successfully import a wallet with the official Nano test vectors seed', async () => {
		const result = await wallet.fromSeed('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
		expect(result.mnemonic).to.be.undefined
		expect(result.seed).to.equal('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')
		expect(result.accounts[0].privateKey).to.equal('3be4fc2ef3f3b7374e6fc4fb6e7bb153f8a2998b3b3dab50853eabe128024143')
		expect(result.accounts[0].publicKey).to.equal('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4')
		expect(result.accounts[0].address).to.equal('nano_1pu7p5n3ghq1i1p4rhmek41f5add1uh34xpb94nkbxe8g4a6x1p69emk8y1d')
	})

	it('should successfully import a legacy hex wallet with the a seed', async () => {
		const result = await wallet.fromLegacySeed('0000000000000000000000000000000000000000000000000000000000000000')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
		expect(result.mnemonic).to.equal('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art')
		expect(result.seed).to.equal('0000000000000000000000000000000000000000000000000000000000000000')
		expect(result.accounts[0].privateKey).to.equal('9f0e444c69f77a49bd0be89db92c38fe713e0963165cca12faf5712d7657120f')
		expect(result.accounts[0].publicKey).to.equal('c008b814a7d269a1fa3c6528b19201a24d797912db9996ff02a1ff356e45552b')
		expect(result.accounts[0].address).to.equal('nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7')
	})

	it('should successfully import legacy hex accounts with the a seed', async () => {
		const accounts = await wallet.legacyAccounts('0000000000000000000000000000000000000000000000000000000000000000', 0, 3)
		expect(accounts[0]).to.have.own.property('accountIndex')
		expect(accounts[0]).to.have.own.property('privateKey')
		expect(accounts[0]).to.have.own.property('publicKey')
		expect(accounts[0]).to.have.own.property('address')
		expect(accounts).to.have.lengthOf(4)
		expect(accounts[2].accountIndex).to.equal(2)
		expect(accounts[2].privateKey).to.equal('6a1804198020b080996ba45b5891f8227d7a4f41c8479824423780d234939d58')
		expect(accounts[2].publicKey).to.equal('2fea520fe54f5d0dca79d553d9c7f5af7db6ac17586dbca6905794caadc639df')
		expect(accounts[2].address).to.equal('nano_1dzcca9ycmtx3q79mocmu95zdduxptp3gp5fqkmb1ownscpweggzah8cb4rb')
	})

	it('should throw when given a seed with a length too short', async () => {
		try {
			await wallet.generate('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310')
			expect.fail()
		} catch (err) {
			expect(err).to.be.an('error')
		}
	})

	it('should throw when given a seed with a length too long', async () => {
		try {
			await wallet.generate('0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310cd')
			expect.fail()
		} catch (err) {
			expect(err).to.be.an('error')
		}
	})

	it('should throw when given a seed containing non-hex characters', async () => {
		try {
			await wallet.generate('0gc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c')
			expect.fail()
		} catch (err) {
			expect(err).to.be.an('error')
		}
	})

	it('should successfully create a new legacy wallet and get the same result from importing one from the mnemonic', async () => {
		const result = await wallet.generateLegacy('BE3E51EE51BAB11950B2495013512FEB110D9898B4137DA268709621CE2862F4')
		expect(result).to.have.own.property('mnemonic')
		expect(result).to.have.own.property('seed')
		expect(result).to.have.own.property('accounts')
		expect(result.mnemonic).to.equal('sail verb knee pet prison million drift empty exotic once episode stomach awkward slush glare list laundry battle bring clump brother before mesh pair')

		const imported = await wallet.fromLegacyMnemonic(result.mnemonic)
		expect(imported.mnemonic).to.equal(result.mnemonic)
		expect(imported.seed.toUpperCase()).to.equal(result.seed)
		expect(imported.accounts[0].privateKey).to.equal(result.accounts[0].privateKey)
	})

})
