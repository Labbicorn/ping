#![allow(clippy::result_large_err)]
use anchor_lang::prelude::*;

declare_id!("3ZfaRDMpfJFWiC9UR1Cs1oEDdopvN71jezU8QvgHjZXf");

#[program]
pub mod ping {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initialize ping program");
        let ping_name = &mut ctx.accounts.ping_name;
        ping_name.ping_counter = 0;
        Ok(())
    }

    pub fn ping(ctx: Context<Ping>) -> Result<()> {
        let ping_name = &mut ctx.accounts.ping_name;
        ping_name.ping_counter += 1;
        msg!("Ping {} times", ping_name.ping_counter);
        Ok(())
    }

    pub fn update(ctx: Context<Update>, num: u64) -> Result<()> {
        let ping_name = &mut ctx.accounts.ping_name;
        ping_name.ping_counter = num;
        msg!("update to {} ", ping_name.ping_counter);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8, seeds = [b"ping"], bump)]
    // #[account(init, payer = user, space = 8 + 8, seeds = [], bump)]
    pub ping_name: Account<'info, PingData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Ping<'info> {
    #[account(mut, seeds = [b"ping"], bump)]
    pub ping_name: Account<'info, PingData>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut, seeds = [b"ping"], bump)]
    pub ping_name: Account<'info, PingData>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct PingData {
    pub ping_counter: u64,
}
