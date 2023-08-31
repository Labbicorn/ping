import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Ping } from "../target/types/ping";

describe("ping", () => {
  let provider = anchor.AnchorProvider.env();
  // Configure the client to use the local cluster.
  anchor.setProvider(provider);

  const program = anchor.workspace.Ping as Program<Ping>;

  // const pingAccount = anchor.web3.Keypair.generate();
  let [pingAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ping")],
    // [],
    program.programId
  );
  console.log("Your counter address", pingAccount.toBase58());

  const user = provider.wallet.publicKey;
  console.log("Your wallet address", user.toBase58());

  // const payer = anchor.AnchorProvider.env().wallet;
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        pingName: pingAccount,
        user,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    // Fetch the state struct from the network.
    const pingDataAccount = await program.account.pingData.fetch(pingAccount);
    console.log("ping account state: ", pingDataAccount);
  });

  it("pnig!", async () => {
    // Add your test here.
    const tx = await program.methods
      .ping()
      .accounts({
        pingName: pingAccount,
        user: user,
      })
      .rpc();

    console.log("Your transaction signature", tx);
    const tx1 = await program.methods
      .ping()
      .accounts({
        pingName: pingAccount,
        user: user,
      })
      .rpc();

    console.log("Your transaction signature", tx1);

    // Fetch the state struct from the network.
    const pingDataAccount = await program.account.pingData.fetch(pingAccount);
    console.log("ping account state: ", pingDataAccount);
  });
});
