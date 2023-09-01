import * as Web3 from '@solana/web3.js';
import * as fs from 'fs';
import dotenv from 'dotenv';
import * as anchor from '@project-serum/anchor';
import idl from "../idl/ping.json";
dotenv.config();

const PROGRAM_ID = new Web3.PublicKey(idl.metadata.address);

async function main() {
  const connection = new Web3.Connection("http://127.0.0.1:8899", 'confirmed');
  const signer = await initializeKeypair();

  // const secret = JSON.parse(fs.readFileSync('/Users/davirain/.config/solana/id.json', 'utf8')) as number[];
  // const secretKey = Uint8Array.from(secret);
  // const signer = Web3.Keypair.fromSecretKey(secretKey);

  console.log("公钥:", signer.publicKey.toBase58());

  await airdropSolIfNeeded(signer, connection);
  let wallet = new anchor.Wallet(signer);
  const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);

  console.log("programId:", PROGRAM_ID.toBase58());
  const program = new anchor.Program(idl as anchor.Idl, PROGRAM_ID, provider);
  // console.log("program ", program);

  // await PingInit(program, signer);

  await Ping(program, signer);
}

main()
  .then(() => {
    console.log('执行成功完成');
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

async function initializeKeypair(): Promise<Web3.Keypair> {
  // 如果没有私钥，生成新密钥对
  if (!process.env.PRIVATE_KEY) {
    console.log('正在生成新密钥对... 🗝️');
    const signer = Web3.Keypair.generate();

    console.log('正在创建 .env 文件');
    fs.writeFileSync('.env', `PRIVATE_KEY=[${signer.secretKey.toString()}]`);

    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? '') as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecret = Web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecret;
}

async function airdropSolIfNeeded(
  signer: Web3.Keypair,
  connection: Web3.Connection
) {
  // 检查余额
  const balance = await connection.getBalance(signer.publicKey);
  console.log('当前余额为', balance / Web3.LAMPORTS_PER_SOL, 'SOL');

  // 如果余额少于 10 SOL，执行空投
  if (balance / Web3.LAMPORTS_PER_SOL < 10) {
    console.log('正在空投 10 SOL');
    const airdropSignature = await connection.requestAirdrop(
      signer.publicKey,
      10 * Web3.LAMPORTS_PER_SOL
    );

    const latestBlockhash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    const newBalance = await connection.getBalance(signer.publicKey);
    console.log('新余额为', newBalance / Web3.LAMPORTS_PER_SOL, 'SOL');
  }
}

async function PingInit(program: anchor.Program, payer: Web3.Keypair) {
  let [pingAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ping")],
    PROGRAM_ID
  );

  const transactionSignature = await program.methods
    .initialize()
    .accounts({
      pingName: pingAccount,
      user: payer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log(
    `Transaction https://explorer.solana.com/tx/${transactionSignature}?cluster=custom`
  )
}

async function Ping(program: anchor.Program, payer: Web3.Keypair) {
  let [pingAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ping")],
    PROGRAM_ID
  );
  console.log("pingAccount:", pingAccount.toBase58());

  const transactionSignature = await program.methods
    .ping()
    .accounts({
      pingName: pingAccount,
      user: payer.publicKey,
    })
    .rpc();

  console.log(
    `Transaction https://explorer.solana.com/tx/${transactionSignature}?cluster=custom`
  )
}
