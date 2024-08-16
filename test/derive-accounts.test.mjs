// SPDX-FileCopyrightText: 2024 Chris Duncan <chris@zoso.dev>
// SPDX-License-Identifier: GPL-3.0-or-later

'use strict'

import { describe, it } from 'node:test'
import { strict as assert } from 'assert'
import { wallet } from '../dist/index.js'

// WARNING: Do not send any funds to the test vectors below
// Test vectors from https://docs.nano.org/integration-guides/key-management/ and elsewhere
describe('derive more accounts from the same seed test', () => {

	it('should derive accounts from the given seed', async () => {
		const result = await wallet.accounts(
			'0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c',
			0, 14)
		expect(result.length).to.equal(15)
		expect(result[0].privateKey).to.equal('3be4fc2ef3f3b7374e6fc4fb6e7bb153f8a2998b3b3dab50853eabe128024143')
		expect(result[0].publicKey).to.equal('5b65b0e8173ee0802c2c3e6c9080d1a16b06de1176c938a924f58670904e82c4')
		expect(result[0].address).to.equal('nano_1pu7p5n3ghq1i1p4rhmek41f5add1uh34xpb94nkbxe8g4a6x1p69emk8y1d')
		expect(result[14].privateKey).to.equal('5f12e37c64daf2501c6a6a20614fd8d977fed65b5b5f0b045ec997f2ed2f53ca')
		expect(result[14].publicKey).to.equal('f93a61018e07825a095e8cf7bdce9242e9c12c5c41a55de597a2be93fa41306b')
		expect(result[14].address).to.equal('nano_3ybte61rw3w4da6ox59qqq9b6iqbr6p7rif7dqkshaoykhx64e5dbp4o1ua1')

		const result2 = await wallet.accounts(
			'0dc285fde768f7ff29b66ce7252d56ed92fe003b605907f7a4f683c3dc8586d34a914d3c71fc099bb38ee4a59e5b081a3497b7a323e90cc68f67b5837690310c',
			1000000000, 1000000099)
		expect(result2.length).to.equal(100)
	})

})
