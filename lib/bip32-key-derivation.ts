import { createHmac } from 'crypto'
import Convert from './util/convert'

const ED25519_CURVE = 'ed25519 seed'
const HARDENED_OFFSET = 0x80000000

export default class Bip32KeyDerivation {

	static derivePath = (path: string, seed: string): Chain => {
		const { key, chainCode } = this.getKeyFromSeed(seed)
		const segments = path
			.split('/')
			.map(v => v.replace('\'', ''))
			.map(el => parseInt(el, 10))
		return segments.reduce(
			(parentKeys, segment) =>
				this.CKDPriv(parentKeys, segment + HARDENED_OFFSET),
			{ key, chainCode }
		)
	}

	private static getKeyFromSeed = (seed: string): Chain => {
		return this.derive(
			Buffer.from(seed, 'hex').toString('hex'),
			Buffer.from(ED25519_CURVE, 'utf8').toString('hex'))
	}

	private static CKDPriv = ({ key, chainCode }: Chain, index: number) => {
		const ib = []
		ib.push((index >> 24) & 0xff)
		ib.push((index >> 16) & 0xff)
		ib.push((index >> 8) & 0xff)
		ib.push(index & 0xff)
		const data = `00${key}${Convert.ab2hex(new Uint8Array(ib).buffer)}`

		return this.derive(
			Buffer.from(data, 'hex').toString('hex'),
			Buffer.from(chainCode, 'hex').toString('hex'))
	}

	private static derive = (data: string, base: string): Chain => {
		const hmac = createHmac('sha512', base, { encoding: 'hex' })
		const I = hmac.update(data, 'hex').digest('hex')
		const IL = I.slice(0, I.length / 2)
		const IR = I.slice(I.length / 2)

		return {
			key: IL,
			chainCode: IR,
		}
	}

}

export interface Chain {
	key: string
	chainCode: string
}
