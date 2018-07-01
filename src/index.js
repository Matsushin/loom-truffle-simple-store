import Web3 from 'web3'
import { NonceTxMiddleware, SignedTxMiddleware, Client, ClientEvent, Contract, Address, LocalAddress, CryptoUtils, LoomProvider } from 'loom-js'
import LoomTruffleProvider from 'loom-truffle-provider'

const privateKey = CryptoUtils.generatePrivateKey()
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

// クライアントを作成
const client = new Client(
  'default',
  'ws://127.0.0.1:46657/websocket',
  'ws://127.0.0.1:9999/queryws',
)

// 関数呼び出し元のアドレス
const from = LocalAddress.fromPublicKey(publicKey).toString()

// LoomProviderを使って、web3クライアントをインスタンス化 
const web3 = new Web3(new LoomProvider(client, privateKey))

const ABI = [{"anonymous":false,"inputs":[{"indexed":false,"name":"_value","type":"uint256"}],"name":"NewValueSet","type":"event"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]

const contractAddress = '0xf8ea34a6c6d45007b3b82608b1ee8c5106ff1085' // ここにデプロイ時に発行されるコントラクトアドレスを入れます

// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(ABI, contractAddress, {from})

async function setValue(number) {
	const tx = await contract.methods.set(number).send()
	const value = await contract.methods.get().call()

	return value
}

setValue(99999).then((value) => {
	console.log(value)
})

contract.events.NewValueSet({}, (err, event) => {
  if (err) {
    return console.error(err)
  }

  console.log('New value set', event.returnValues._value)
})
