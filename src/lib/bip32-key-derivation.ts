import Convert from './convert.js'

const ED25519_CURVE = 'ed25519 seed'
const HARDENED_OFFSET = 0x80000000

export default class Bip32KeyDerivation {

	static async derivePath (path: string, seed: string): Promise<Chain> {
		let key = await this.getKeyFromSeed(seed)
		const segments = path
			.split('/')
			.map(v => v.replace('\'', ''))
			.map(el => parseInt(el, 10))
		for (const segment of segments) {
			key = await this.CKDPriv(key, segment + HARDENED_OFFSET)
		}
		return key
	}

	private static async getKeyFromSeed (seed: string): Promise<Chain> {
		return await this.derive(
			Buffer.from(seed, 'hex').toString('hex'),
			Buffer.from(ED25519_CURVE, 'utf8').toString('hex'))
	}

	private static async CKDPriv ({ key, chainCode }: Chain, index: number): Promise<Chain> {
		const ib = []
		ib.push((index >> 24) & 0xff)
		ib.push((index >> 16) & 0xff)
		ib.push((index >> 8) & 0xff)
		ib.push(index & 0xff)
		const data = `00${key}${Convert.ab2hex(new Uint8Array(ib).buffer)}`

		return await this.derive(
			Buffer.from(data, 'hex').toString('hex'),
			Buffer.from(chainCode, 'hex').toString('hex'))
	}

	private static derive = async (data: string, base: string): Promise<Chain> => {
		const { createHmac } = await import('crypto')
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
